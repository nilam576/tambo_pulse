
import os

def check_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.json', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                        for i, b in enumerate(content):
                            if b > 127:
                                print(f"Non-ASCII at {path}:{i} - byte {b}")
                except Exception as e:
                    print(f"Error reading {path}: {e}")

check_files('d:/tambo_hack/tambo-pulse/src')
