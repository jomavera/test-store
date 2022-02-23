from flask import request, Response
from flask import Flask
from flask_cors import CORS, cross_origin
import json
import mysql.connector
from mysql.connector import errorcode
import pandas as pd

app = Flask(__name__)
CORS(app)

# --- Ruta para solicitar informacion de productos por categoria y pagina (segun paginacion)
@app.route('/read', methods=['GET'])
@cross_origin()
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

        params = {
        'category': category,
        'limit': limit,
        'offset': offset
        }
        df = pd.read_sql_query("""SELECT * FROM product WHERE category = %(category)s LIMIT %(limit)s OFFSET %(offset)s""",con=conn, params=params)
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
        conn.close()
    else:
        conn.close()

# --- Ruta para busqueda de informacion de productos por nombre y descuento
@app.route('/filter', methods=['GET'])
@cross_origin()
def filter():
    name = request.args.get('name')
    discount = int(request.args.get('discount'))
    page = int(request.args.get('page'))
    limit = 10
    offset = limit *(page - 1)
    try:
        conn = mysql.connector.connect(user='bsale_test',
                                password='bsale_test',
                                host='mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
                                database='bsale_test')

        params = {
            'name': '%'+name+'%',
            'limit':limit,
            'offset': offset,
            'discount':discount
        }
        if name == '':
            df = pd.read_sql_query("""SELECT * FROM product WHERE discount >= %(discount)s LIMIT %(limit)s OFFSET %(offset)s """,con=conn, params=params)
        else:
            df = pd.read_sql_query("""SELECT * FROM product WHERE name LIKE %(name)s AND discount >= %(discount)s LIMIT %(limit)s OFFSET %(offset)s """,con=conn, params=params)
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
        conn.close()
    else:
        conn.close()

# --- Ruta para solicitar informacion de numero de productos en cierta categoria
@app.route('/count', methods=['GET'])
@cross_origin()
def count():
    category_id = int(request.args.get('category_id'))
    try:
        conn = mysql.connector.connect(user='bsale_test',
                                password='bsale_test',
                                host='mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
                                database='bsale_test')

        params = {
            'category_id':category_id
        }
        df = pd.read_sql_query("""SELECT COUNT(*) AS cuenta FROM product WHERE category = %(category_id)s""",con=conn, params=params)

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
        conn.close()
    else:
        conn.close()

if __name__=="__main__":
    app.run(debug=False)