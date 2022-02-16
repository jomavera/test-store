from flask import request, Response
from flask_cors import CORS
from flask_api import FlaskAPI
import json
import mysql.connector
from mysql.connector import errorcode
import pandas as pd

app = FlaskAPI(__name__)

CORS(app)


@app.route('/read', methods=['GET'])
def read():
    category = int(request.args.get('category_id'))
    page = int(request.args.get('page'))
    limit = 10
    offset = limit *(page - 1)
    try:
        conn = mysql.connector.connect(user='bsale_test',
                                password='bsale_test',
                                host='mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
                                database='bsale_test')

        df = pd.read_sql_query(f"SELECT * FROM product WHERE category = {category} LIMIT {limit} OFFSET {offset} ",con=conn)
        result = df.to_json(orient="records")
        parsed = json.loads(result)
        conn.close()
        return Response(json.dumps(parsed),  mimetype='application/json')

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        conn.close()

@app.route('/filter', methods=['GET'])
def filter():
    name = request.args.get('name')
    print(f"nombre: {name}")
    discount = int(request.args.get('discount'))
    page = int(request.args.get('page'))
    limit = 10
    offset = limit *(page - 1)
    try:
        conn = mysql.connector.connect(user='bsale_test',
                                password='bsale_test',
                                host='mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
                                database='bsale_test')

        if name == '':
            df = pd.read_sql_query(f"SELECT * FROM product WHERE discount >= {discount} LIMIT {limit} OFFSET {offset} ",con=conn)
        else:
            df = pd.read_sql_query(f"SELECT * FROM product WHERE name LIKE '%{name}%' AND discount >= {discount} LIMIT {limit} OFFSET {offset} ",con=conn)
        result = df.to_json(orient="records")
        parsed = json.loads(result)
        conn.close()
        return Response(json.dumps(parsed),  mimetype='application/json')
        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        conn.close()

@app.route('/count', methods=['GET'])
def count():
    category_id = int(request.args.get('category_id'))
    try:
        conn = mysql.connector.connect(user='bsale_test',
                                password='bsale_test',
                                host='mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
                                database='bsale_test')

        df = pd.read_sql_query(f"SELECT COUNT(*) AS cuenta FROM product WHERE category = {category_id}",con=conn)

        result = df.to_json(orient="records")
        parsed = json.loads(result)
        conn.close()
        return Response(json.dumps(parsed),  mimetype='application/json')
        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        conn.close()

if __name__=="__main__":
    app.run(debug=True)