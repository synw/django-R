# -*- coding: utf-8 -*-

import rethinkdb as r
import reqon
from djR.conf import RETHINKDB_HOST, RETHINKDB_PORT, VERBOSE


class RethinkDB():
    
    def connect(self):
        conn = r.connect(RETHINKDB_HOST, RETHINKDB_PORT).repl()
        return conn

    def write(self, database, table, data):
        conn = self.connect()
        # push data into table
        if VERBOSE is True:
            print "Inserting data into database "+database
        res = r.db(database).table(table).insert(data, return_changes=True, conflict="replace").run(conn)
        if res['errors'] == 0:
            if res["inserted"] > 0:
                if VERBOSE is True:
                    print "Data inserted into table "+table
            if res["replaced"] > 0:
                if VERBOSE is True:
                    print "Data updated in table "+table
        else:
            print "ERROR: "+str(res['errors'])
        conn.close()
        return
    
    def run_query(self, r_query, profile=False):
        conn = self.connect()
        return r_query.run(conn, profile=profile)
    
    def run_json(self, json_q, profile=False):
        reql = reqon.build_reql(json_q)
        if profile is True:
            qres = self.run_query(reql, profile=profile)
            res = qres['value']
            profile = qres['profile']
            return res, profile
        else:
            res = self.run_query(reql)
            return res
    
R = RethinkDB()