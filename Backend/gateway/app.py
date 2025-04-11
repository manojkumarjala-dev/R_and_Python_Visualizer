from flask import Flask, request, jsonify
import os
import uuid
import subprocess
from flask_cors import CORS
import re

# This is a Flask application that runs Python or R code in Docker containers
# The application listens for POST requests on the /run endpoint,
app = Flask(__name__, static_url_path="/static", static_folder="static")
CORS(app)


# Create directories for temporary files and static outputs
# Ensure the directories exist
TEMP_DIR = "temp"
STATIC_DIR = "static/outputs"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

@app.route("/run", methods=["POST"])
def run_code():
    # Get the code and language from the request body
    data = request.get_json()
    code = data.get("code")
    language = data.get("language")
    extention = data.get("extention")

    if not code or not language:
        return jsonify({"error": "Need both language and code to execute"}), 400

    unique_id = uuid.uuid4().hex
    ext = "py" if language == "python" else "R"
    filename = f"{unique_id}.{ext}"
    filepath = os.path.join(TEMP_DIR, filename)

    # extension_match = re.search(r'(savefig|write_html|)\s*\(\s*["\']([^/\\]+?\.(png|html))["\']',code)

    # if extension_match:
    #     original_filename = extension_match.group(2)  # e.g. "output.png" or "output.html"
    #     file_ext = extension_match.group(3)           # "png" or "html"
    # else:
    #     return jsonify({"error": "Could not detect output filename in your code"}), 400

    #output_filename = f"{uuid.uuid4().hex}.{file_ext}"
    output_filename = f"{uuid.uuid4().hex}.{extention}"
    
    #print(f"Generated output filename: {output_filename}")

    static_output_path = os.path.join(STATIC_DIR, output_filename)

    # Replace the original filename in code with correct path
    #code = code.replace(output_filename, f"/static/outputs/{output_filename}")
    code = code.replace("__OUTPUT__", f"/static/outputs/{output_filename}")


    # Save the code file
    with open(filepath, "w") as f:
        f.write(code)

    try:
        if language == "python":
            cmd = [
                "docker", "run", "--rm",
                "-v", f"{os.path.abspath(TEMP_DIR)}:/temp",
                "-v", f"{os.path.abspath(STATIC_DIR)}:/static/outputs",
                "python-visualization",
                "python", f"/temp/{filename}"
            ]
        elif language == "r":
            cmd = [
                "docker", "run", "--rm",
                "-v", f"{os.path.abspath(TEMP_DIR)}:/temp",
                "-v", f"{os.path.abspath(STATIC_DIR)}:/static/outputs",
                "r-visualization",
                "Rscript", f"/temp/{filename}"
            ]
        else:
            return jsonify({"error": f"Unsupported language: {language}"}), 400

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

        # Delete temp code file after execution
        os.remove(filepath)

        if result.returncode != 0:
            return jsonify({"error": result.stderr}), 400

        # Confirm the output file exists
        if not os.path.exists(static_output_path):
            return jsonify({"error": "No output file was generated"}), 500

        file_url = f"/static/outputs/{output_filename}"
        return jsonify({
            "output": result.stdout,
            "type": extention,
            "file_url": file_url
        })

    except subprocess.TimeoutExpired:
        os.remove(filepath)
        return jsonify({"error": "Execution timed out"}), 408
    except FileNotFoundError:
        os.remove(filepath)
        return jsonify({"error": "Docker not installed or accessible"}), 500
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
