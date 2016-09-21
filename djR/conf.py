# -*- coding: utf-8 -*-

from django.conf import settings


RETHINKDB_HOST = getattr(settings, 'RETHINKDB_HOST', 'localhost')
RETHINKDB_PORT = getattr(settings, 'RETHINKDB_PORT', 28015)

DEFAULT_DB = getattr(settings, 'R_DEFAULT_DB', None)
    
VERBOSE = getattr(settings, 'R_VERBOSE', True)