Django R
========

Toolkit to use Rethinkdb in Django. Features:

- Interface to explore the Rethinkdb data
- Helpers for basic operations

This module was made to give an easy access to the Rethinkdb functionalities inside of the Django environement. 
We are not trying to replace the classic Django orm nor the builtin Rethinkdb admin interface. It is just a set
of tools to ease the use of Rethinkdb in Django.

Install
-------

  ```python
pip install rethinkdb geojson jsonschema six
pip install git+https://github.com/dmpayton/reqon.git
pip install git+https://github.com/synw/django-R.git
  ```

Add `'djR',` to installed apps.

Urls: `url('^r/', include('djR.urls')),`

Optional settings
-----------------

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

Go to `/r/` as superuser and start to explore the data.

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

q = {"$db":"mydb", "$table":"mytable", "$query":[["$pluck":"myfield"]]}
R.run_json(q)
  ```
  
See the Requon doc for the json query format specifications.

Screenshot
----------

![Data explorer screenshot](https://raw.github.com/synw/django-R/master/docs/img/djR_explorer.png)

Todo
----

- Merge [django-changefeed](https://github.com/synw/django-changefeed) into here
- Add more query options: pluck, filters, etc..

Thanks
------

- To the [Rethinkdb](https://rethinkdb.com) guys
- To [Requon](https://github.com/dmpayton/reqon.git)