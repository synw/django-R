# -*- coding: utf-8 -*-

from django import template
from djR.conf import DEFAULT_DB


register = template.Library()

@register.simple_tag
def get_default_db():
    return DEFAULT_DB