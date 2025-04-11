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

## License

This project is for academic/demo use. No license specified yet.
