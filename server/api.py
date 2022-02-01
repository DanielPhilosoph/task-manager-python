from flask import Flask, request, abort
import psutil
import csv
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)


@app.route('/get-info')
def get_info():
    processes_list = []
    for proc in psutil.process_iter():
        try:
            processes_list.append(proc.as_dict(
                attrs=['pid', 'name', 'cpu_percent']))
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return {
        "cpu_percent": psutil.cpu_percent(),
        "PID list": processes_list}


@app.route("/save", methods=['POST'])
@cross_origin()
def save():
    request_data = request.get_json()
    if(isinstance(request_data["data"], list)):
        with open('saved.csv', 'w', encoding='UTF8', newline='') as f:
            writer = csv.DictWriter(
                f, fieldnames=['pid', 'name', 'cpu_percent'])
            writer.writeheader()
            writer.writerows(request_data["data"])
        return "done"
    abort(404)


@app.route('/')
def hello():
    return "root"


if(__name__ == "__main__"):
    app.run()
