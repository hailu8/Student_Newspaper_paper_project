import json
import csv
import db_access
try:
    import simplejson as json
except ImportError:
    import json
from flask import Flask, request, Response, render_template,url_for
import psycopg2 # use this package to work with postgresql

app = Flask(__name__, static_url_path='/static')

nonce = db_access.get_connection(debug=False)


@app.route('/', methods=["GET"])
def renderPage():
    return render_template("index.html")


@app.route('/scatterplot.js', methods=["GET"])
def renderVis():
    return render_template("scatterplot.js")

@app.route('/get-date-range/<start_date>/<end_date>')
def get_date_range(start_date, end_date):
    data = db_access.real_get_range_query(nonce, start_date, end_date)
    #data = db_access.real_get_month_bin(nonce, start_date, end_date)​
    resp = Response(response=json.dumps(data),
                    status=200, mimetype='application/json')
    h = resp.headers  # response to give back to user on browser
    h['Access-Control-Allow-Origin'] = "*"
    return resp  # send response to client

@app.route('/get-paper-date-range/<paper>/<start_date>/<end_date>')
def get_paper_date_range(paper,start_date,end_date):
    # print(start_date)
    data = db_access.real_get_paper_range_query(nonce, paper, start_date, end_date)
    resp = Response(response=json.dumps(data),status=200, mimetype='application/json') 
    h = resp.headers  # response to give back to user on browser
    h['Access-Control-Allow-Origin'] = "*"
    return resp  # send response to client
    
@app.route('/get-keywords/<keyword>/<paper>/<start_date>/<end_date>')
def get_keywords(keyword,paper,start_date,end_date):
    data = db_access.real_get_keywords(nonce,keyword,paper,start_date,end_date)
    resp = Response(response=json.dumps(data),status=200, mimetype='application/json')
    h = resp.headers  # response to give back to user on browser
    h['Access-Control-Allow-Origin'] = "*"
    return resp  # send response to client

@app.route('/get-data/<identity>')
def getData(identity):
    data = db_access.real_get_data_query(nonce, identity)

    resp = Response(response=json.dumps(data),
                    status=200,
                    mimetype='application/json')
    h = resp.headers  # response to give back to user on browser
    h['Access-Control-Allow-Origin'] = "*"
    return resp  # send response to client



@app.route('/get-data-scat')
def getData_CSV():
  filename = request.args.get('filename')
  data = []
  try:
    with open(filename, 'r') as f:
      reader = csv.DictReader(f)
      for row in reader:
        data.append(row)
    resp = Response(response=json.dumps(data),status=200, mimetype='application/json')
    h = resp.headers
    h['Access-Control-Allow-Origin'] = "*"
    return resp
  except Exception as err:
    #print(err)
    #return str(err)
    raise err



if __name__ == "__main__":
    app.run("127.0.0.1", debug=True, port=8000)
