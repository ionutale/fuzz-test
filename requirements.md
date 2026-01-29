Requirements: "FuzzTest" (CI Fuzz Clone)
1. Project Overview
FuzzTest is a developer-friendly, coverage-guided fuzzing CLI tool. It automates the process of instrumenting code, generating random-but-smart inputs, and catching crashes (segfaults, out-of-bounds, etc.) in a local environment.

2. Technical Stack
Language: Go (for the CLI and orchestrator) or Rust.

Target Languages (MVP): C/C++ (using LLVM/libFuzzer) and Java (using JQF).

Instrumentation: LLVM-based Sanitizers (AddressSanitizer, UndefinedBehaviorSanitizer).

Database: SQLite (to track local runs, findings, and code coverage).

3. Core Features & Requirements
A. CLI Interface (The "UX")
The agent must implement a CLI with the following commands:

fuzz init: Detects project language and creates a fuzz_config.yaml.

fuzz create [function_name]: Scaffolds a "fuzz target" (a wrapper function that feeds fuzzer data into the target function).

fuzz run: Compiles the code with instrumentation, starts the fuzzer, and displays a live dashboard (executions per second, coverage percentage, bugs found).

B. Instrumentation Engine
The system must automatically modify compiler flags to include -fsanitize=fuzzer,address,undefined.

It must handle the build process for CMake and Maven projects automatically to inject these flags.

C. The Fuzzing Loop
Input Generation: Use a genetic algorithm approach (mutating a corpus of inputs).

Feedback Loop: Capture STDOUT/STDERR from the target. If a crash occurs, save the "minimizing" input (the specific string/bytes that caused the crash) to a findings/ folder.

Corpus Management: Store successful "interesting" inputs in a local directory to reuse for future runs.

D. Reporting & Analysis
Generate a summary report in Markdown after a run is stopped.

Provide a "repro" command: fuzz repro [finding_id] which runs the code once with the crashing input to allow a developer to attach a debugger.

4. Architecture Diagram
5. Success Criteria for the "One-Shot" Build
Autonomous Build: The AI must generate a Makefile or docker-compose.yml that sets up the environment (LLVM/Clang) without user intervention.

The "Crash Test": Include a sample C++ project with a hidden buffer overflow. The AI agent's code must successfully find this bug within 60 seconds of running fuzz run.

Clean Exit: The fuzzer must handle Ctrl+C gracefully, saving the current state and corpus.

6. Constraints & Safety
The tool should run in a Docker container to prevent malicious/crashing code from affecting the host machine.

Focus on libFuzzer as the backend engine for the MVP to reduce complexity.

Tips for your AI Agent:
Agent Choice: Use a tool with high "reasoning" capabilities (like Claude 3.5 Sonnet or GPT-4o) and ensure it has access to a filesystem and shell (e.g., via a coding agent like Replit Agent or Devin).

Context: If the agent gets stuck on the instrumentation, tell it to "Look at how AFL++ or libFuzzer handles the LLVM_PROFILE_FILE environment variable."