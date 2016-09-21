Django R
========

Toolkit to use Rethinkdb in Django. Features:

- Interface to explore the Rethinkdb data
- Helper functions for basic operations

Install
-------

`pip install rethinkdb`

Clone then add `'djR',` to installed apps.

Urls: `url('^r/', include('djR.urls')),`

Settings
--------

  ```python
# default: 'localhost'
RETHINKDB_HOST = ip_here
# default: 28015
RETHINKDB_PORT = 28500
# default: None
R_DEFAULT_DB = "mydb"
# default: True
R_VERBOSE = False
  ```

Usage
-----

Go to `/r/` to explore the data.

Run a query:

  ```python
from rethinkdb import r
from djR.r_producers import R

q = r.db('mydb').table('mytable').pluck('myfield')
R.run_query(q)
  ```

Run a query from json: you will need [Requon](https://github.com/dmpayton/reqon.git):

  ```python
from djR.r_producers import R

q = {"db":"mydb", "table":"mytable", "query":[["$pluck":"myfield"]]}
R.run_json(q)
  ```
  
See the Requon doc for the json format specifications.

![Data explorer screenshot](https://raw.github.com/synw/django-R/master/docs/img/djR_explorer.png)

Todo
----

Merge [django-changefeed](https://github.com/synw/django-changefeed) into here