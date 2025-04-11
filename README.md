# R and Python Code Visualizer

This project allows users to write and execute Python or R code for data visualizations directly in the browser. The backend runs the code securely in Docker containers and returns either static images (PNG) or interactive HTML outputs.

---

## Project Structure

```
R_and_Python_Visualizer/
│
├── Backend/
│   └── gateway/           # Flask API for code execution
│          ├── static/outputs/        # Folder for generated output files (shared with Docker)
│          └── temp/                  # Temporary folder for saving code before execution
│          └── app.py/                # app function
├── frontend/              # React + Vite client


```

---

## Backend API Documentation

### Base URL

```
http://localhost:5001
```

### Endpoint

#### `POST /run`

Accepts a code snippet in Python or R and runs it inside a Docker container.

**Request Body:**

```json
{
  "language": "python",     // or "r"
  "code": "plt.plot([1,2]); plt.savefig('__OUTPUT__')",
  "extention": "png"        // or "html"
}
```

**Special Note:**  
Always use `"__OUTPUT__"` as the filename inside your code. The backend replaces it with a unique, correct path before execution.

---

**Successful Response:**

```json
{
  "output": "",                          // stdout from the code execution, if any
  "type": "png",                         // png or html
  "file_url": "/static/outputs/abc.png"  // accessible URL for frontend
}
```

**Error Response:**

```json
{
  "error": "Traceback or execution failure reason"
}
```

---

## Docker Execution Workflow

1. The backend receives Python or R code and writes it to a temporary `.py` or `.R` file.
2. A unique output file path is generated and replaces `"__OUTPUT__"` in the code.
3. The backend launches a Docker container using:
   - `python-visualization` for Python
   - `r-visualization` for R
4. It mounts two local folders:
   - `temp/` → where the code file is saved
   - `static/outputs/` → where the output (PNG or HTML) is saved
5. Docker runs the script. Any file saved in `/static/outputs/` inside the container appears in the local `static/outputs/` folder.
6. The API returns the result and a URL pointing to the generated file.

---

## Local Setup

### 1. Backend

```bash
cd Backend/gateway
pip install -r requirements.txt
python app.py
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Build Docker Images
Go inside of the folders and run the command to generate container images
```bash
# Python environment with matplotlib, seaborn, plotly
docker build -t python-visualization .

# R environment with ggplot2, plotly, rgl
docker build -t r-visualization .
```

---

## Notes

- Make sure Docker is installed and running.
- Ports used: `5001` for the backend, `5173` (default) for the frontend.
- All outputs are saved in `static/outputs/` and served via Flask as static files.

---
## Screenshots

### Homepage Overview
![Screenshot 2025-04-11 at 5 14 50 PM](https://github.com/user-attachments/assets/121d8c7f-89ea-464a-826e-058448f55543)

### Visualizer page
![Screenshot 2025-04-11 at 5 15 00 PM](https://github.com/user-attachments/assets/50953945-f962-47fb-8f7e-5c88db7338b2)

### Dropdown Options for Language and Format
![Screenshot 2025-04-11 at 5 15 23 PM](https://github.com/user-attachments/assets/aed8d76d-181f-4297-95b4-0cfa94b33fb0)

### R Example
![Screenshot 2025-04-11 at 5 15 55 PM](https://github.com/user-attachments/assets/1578cac1-ba7c-4e4b-b9c6-10f96c001452)

### Python Example
![Screenshot 2025-04-11 at 5 16 34 PM](https://github.com/user-attachments/assets/a4e316b1-1028-4f94-8629-83f4c5d414f1)


## Issue Faced: Extracting Output File Extension in Backend

While building the backend, I initially tried to extract the output file extension (like `png` or `html`) by parsing the user-submitted code using regex. The idea was to detect functions like `plt.savefig("filename.png")` or `saveWidget(fig, "filename.html")` and extract the file type from there.

This approach worked fine for simple Python code, but quickly became unreliable when dealing with R code — especially with cases like `ggsave()` or `htmlwidgets::saveWidget()` where the syntax varies and whitespace, parameters, or full paths made it hard to match consistently.

To avoid overcomplicating the regex and prevent unexpected behavior, I decided to stop parsing file type from the code altogether.

### How I Resolved It

Instead of expecting the user to provide a file name, I standardized the approach by requiring them to write `__OUTPUT__` in their code wherever the output should be saved and the option to choose png or html based on the type of image(static or dynamic/3d).

Example:

```python
plt.savefig("__OUTPUT__")
```

or

```r
saveWidget(fig, "__OUTPUT__")
```

Then, in the backend, I generate a unique filename (like a UUID with the correct extension), replace `__OUTPUT__` with the full path to the shared output folder, and execute the code. This approach made the system more predictable, cleaner, and language-agnostic.


## License

This project is for academic/demo use. No license specified yet.
