#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Xiaobo Yang
@contact: hal_42@zju.edu.cn
@software: PyCharm
@file: server.py
@time: 2019/4/27 7:26
@desc:
"""
from functools import wraps
from flask import Flask
from flask import request, jsonify, make_response
from solve_multi import Solve

app = Flask(__name__)

def allowCROD(func):
     def wrapper(*arg, **kwargs):
         resp = make_response(func(*arg, **kwargs))
         resp.headers['Access-Control-Allow-Origin'] = '*'
         resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
         resp.headers['Access-Control-Allow-Headers'] = '*'
         return resp
     return wrapper


@app.route('/GetMove',methods=['GET', 'POST', 'OPTIONS'])
@allowCROD
def GetMove():
    resp = make_response()
    if request.method == 'GET':
        app.logger.info('Get an GET request')

        resp = make_response('You Sent an Get Request')
        return resp
    elif request.method == 'POST':
        app.logger.info('Get an Post request')

        req_data = request.get_json()
        app.logger.info(req_data)


        resp = Solve(req_data)
        # resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    elif request.method == 'OPTIONS':
        app.logger.info('Get an OPTION request')
        return resp
    else:
        app.logger.error('Unrecognized Request')

        resp = make_response("Unrecognized Request")
        return resp


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)