# -*- coding: utf-8 -*-

from django.conf.urls import url
from djR.views import RView, RpostView


urlpatterns = [
    url(r'^query/$', RpostView.as_view(), name="r-post"),
    url(r'^', RView.as_view(), name="r-index"),
    ]

