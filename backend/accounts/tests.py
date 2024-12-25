from django.test import TestCase
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your tests here.
class TestView(APIView):
    def get(self, request, format=None):
        print("API Was Called")
        return Response("You Made It", status=200)
    
