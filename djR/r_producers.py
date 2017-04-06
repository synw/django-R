from __future__ import print_function
import json
import rethinkdb as r
import reqon
from djR.conf import RETHINKDB_HOST, RETHINKDB_PORT, RETHINKDB_USER, RETHINKDB_PASSWORD, VERBOSE


class RethinkDB():
    
    def connect(self, db=None):
        if db is None:
            if RETHINKDB_USER is not None and RETHINKDB_PASSWORD is not None:
                conn = r.connect(host=RETHINKDB_HOST, port=RETHINKDB_PORT, user=RETHINKDB_USER, password=RETHINKDB_PASSWORD).repl()
            else:
                conn = r.connect(host=RETHINKDB_HOST, port=RETHINKDB_PORT)
        else:
            if RETHINKDB_USER is not None and RETHINKDB_PASSWORD is not None:
                conn = r.connect(host=RETHINKDB_HOST, port=RETHINKDB_PORT, db=db, user=RETHINKDB_USER, password=RETHINKDB_PASSWORD).repl()
            else:
                conn = r.connect(host=RETHINKDB_HOST, port=RETHINKDB_PORT, db=db)
        return conn
    
    def get_filtered(self, database, table, filters={}, profile=False):
        conn = self.connect()
        q = r.db(database).table(table).filter(filters)
        if profile is True:
            res, profile = self.run_query(q, profile=True)
        else:
            res = self.run_query(q)
        conn.close()
        return res

    def write(self, database, table, data, conflict="replace"):
        conn = self.connect()
        # push data into table
        res = r.db(database).table(table).insert(data, return_changes=True, conflict=conflict).run(conn)
        if VERBOSE is True:
            if res['errors'] == 0:
                if res["inserted"] > 0:
                    if VERBOSE is True:
                        print("Data inserted into table "+table)
                if res["replaced"] > 0:
                    if VERBOSE is True:
                        print("Data updated in table "+table)
        if res['errors'] > 0:
            print("Rethinkdb ERROR: "+str(res['errors']))
        conn.close()
        return res

    def update(self, database, table, data, filters):
        conn = self.connect()
        # push data into table
        res = r.db(database).table(table).filter(filters).update(data, return_changes=True).run(conn)
        if VERBOSE is True:
            if res['errors'] == 0:
                if res["inserted"] > 0:
                    if VERBOSE is True:
                        print("Data inserted into table "+table)
                if res["replaced"] > 0:
                    if VERBOSE is True:
                        print("Data updated in table "+table)
        if res['errors'] > 0:
            print("Rethinkdb ERROR: "+str(res['errors']))
        conn.close()
        return res
    
    def delete(self, database, table, item_id, profile=False):
        conn = self.connect()
        q = r.db(database).table(table).get(item_id).delete()
        if profile is True:
            res, profile = self.run_query(q, profile=True)
        else:
            res = self.run_query(q)
        conn.close()
        return res

    def delete_filtered(self, database, table, filters={}, profile=False):
        conn = self.connect()
        q = r.db(database).table(table).filter(filters).delete()
        if profile is True:
            res, profile = self.run_query(q, profile=True)
        else:
            res = self.run_query(q)
        conn.close()
        return res
    
    def run_query(self, r_query, profile=False):
        conn = self.connect()
        res = r_query.run(conn, profile=profile)
        conn.close()
        return res
    
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

    def visualize_query(self, r_query):
        res = list(R.run_query(r_query))
        for result in res:
            yield
            
    def print_query(self, r_query):
        res = R.run_query(r_query)
        print("QUERY: "+str(r_query))
        print(json.dumps(res, indent=4))
        return
        
R = RethinkDB()
