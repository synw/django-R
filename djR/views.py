# -*- coding: utf-8 -*-

import json
import rethinkdb as r
from django.http.response import Http404
from django.views.generic import TemplateView
from django_ajax.mixin import AJAXMixin
from django.http import JsonResponse
from djR.r_producers import R


class RView(TemplateView):
    template_name = "djR/index.html"
    
    def get_context_data(self, **kwargs):
        context = super(RView, self).get_context_data(**kwargs)
        if self.request.user.is_superuser is False:
            raise Http404
        context['dbs'] = R.run_query(r.db_list())
        return context


class RpostView(AJAXMixin, TemplateView):
    template_name = "djR/index.html"
    
    def dispatch(self, request, *args, **kwargs):
        if self.request.user.is_superuser is False or not self.request.method == "POST":
            raise Http404       
        q = json.loads(self.request.POST['q'])
        self.time = None
        if not q.has_key('$table'):
            query = r.db(q['$db']).table_list()
            self.results = R.run_query(query)
        else:
            self.results, profile = R.run_json(q, profile=True)
            self.time = profile[0]['duration(ms)']
        if isinstance(self.results, r.Cursor):
            self.results = list(self.results)      
        return super(RpostView, self).dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        self.get_context_data()
        return JsonResponse({'data': self.results, 'time':self.time})