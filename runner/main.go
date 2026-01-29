package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"
)

type JobRequest struct {
	Language string `json:"language"`
	Code     string `json:"code"`
	Duration int    `json:"duration"` // in seconds
}

func main() {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Runner is active"))
	})

	// Start Fuzz Job
	mux.HandleFunc("POST /job", func(w http.ResponseWriter, r *http.Request) {
		var req JobRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Printf("Received fuzz job for %s", req.Language)

		// Generate ID
		jobID := fmt.Sprintf("job-%d", time.Now().UnixNano())
		jobDir := "/app/jobs/" + jobID
		
		if err := os.MkdirAll(jobDir, 0755); err != nil {
			http.Error(w, "Failed to create job dir", http.StatusInternalServerError)
			return
		}

		// Write Source File
		filename := "target.cpp"
		if req.Language == "java" {
			filename = "Target.java"
		}
		if err := os.WriteFile(jobDir+"/"+filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}

		// Create Dockerfile
		var dockerfileContent string
		if req.Language == "cpp" {
			// Using basic clang/llvm image if oss-fuzz is too heavy or not available
			// But for simplicity let's assume we can use a base image with clang
			dockerfileContent = `
FROM silkeh/clang:latest
WORKDIR /src
COPY target.cpp .
# -fsanitize=fuzzer requires clang 6+
RUN clang++ -fsanitize=fuzzer,address,undefined target.cpp -o fuzzer
CMD ["./fuzzer"]
`
		} else {
			dockerfileContent = `FROM alpine:latest
CMD ["echo", "Java not supported yet"]`
		}

		if err := os.WriteFile(jobDir+"/Dockerfile", []byte(dockerfileContent), 0644); err != nil {
			http.Error(w, "Failed to write Dockerfile", http.StatusInternalServerError)
			return
		}

		// Run in background
		go func() {
			log.Printf("[%s] Building image...", jobID)
			buildCmd := exec.Command("docker", "build", "-t", jobID, ".")
			buildCmd.Dir = jobDir
			if out, err := buildCmd.CombinedOutput(); err != nil {
				log.Printf("[%s] Build failed: %v\nOutput: %s", jobID, err, string(out))
				return
			}

			log.Printf("[%s] Running fuzzer...", jobID)
			// Run for specified duration or until crash
			// timeout --signal=SIGINT 60s docker run ...
			// For now just run
			runCmd := exec.Command("docker", "run", "--rm", jobID)
			if out, err := runCmd.CombinedOutput(); err != nil {
				// Non-zero exit usually means crash found (or error)
				log.Printf("[%s] Run finished/crashed: %v\nOutput head:\n%s", jobID, err, string(out[:min(len(out), 1000)]))
				// TODO: Send finding to Web API
			} else {
				log.Printf("[%s] Run finished successfully (no crash)", jobID)
			}
		}()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status": "queued",
			"jobId":  jobID,
		})
	})

	log.Println("Runner Service listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
