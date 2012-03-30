import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json
import os
import sys
import time
import random
import logging
import gmail_imap
import shutil
import traceback

class PimaMail:
    def __init__(self, username, password):
        self.client = gmail_imap.GmailImap(username, password)
        
    def logout(self):
        self.client.logout()
        
    def getStars(self):
        # self.client.messages.process("TO_PIMA")
        self.client.messages.process("[Gmail]/Starred")
        
        ms = self.client.messages.messages
        for m in ms:
            m['body'] = self.client.messages.getMessage(m['uid'])
        return ms 
        
    def removeStars(self, removeUs):
        # self.client.messages.process("TO_PIMA", readonly=False)
        self.client.messages.process("[Gmail]/Starred", readonly=False)
        
        for m in self.client.messages.messages:
            if m['gmailId'] in removeUs:
                response = self.client.imap_server.uid('STORE', m['uid'], '+X-GM-LABELS', '(PIMA)')
                if response[0] != "OK":
                    raise BaseException("wtf?")
                    
                response = self.client.imap_server.uid('STORE', m['uid'], '+flags', '(\\Deleted)')
                if response[0] != "OK":
                    raise BaseException("wtf?")

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.go()
    def do_POST(self):
        self.go()
    def go(self):
        try:
            s = "ok"
            postData = ""
            if self.headers.getheader('content-length'):
                length = int(self.headers.getheader('content-length'))
                postData = self.rfile.read(length)
            
            if self.path == '/api/save':
                shutil.copy('data.txt', 'backup.txt')
                f = open('data.txt', 'w')
                f.write(postData)
                f.close()
            elif self.path == '/api/gmail':
                params = postData.split(',')
                pm = PimaMail(params[0], params[1])
                s = json.dumps(pm.getStars())
                pm.logout()
            elif self.path == '/api/gmail-removeStars':
                params = postData.split(',')
                pm = PimaMail(params[0], params[1])
                pm.removeStars(set(params[2:]))
                pm.logout()
            else:
                p = self.path
                if p == '/':
                    p = '/index.html'
                f = open('.' + p)
                s = f.read()
                f.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(s)
        except:
            self.send_response(500)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(traceback.format_exc())

def main():
    # ensure existance of data.txt
    try:
        f = open('./data.txt')
    except:
        f = open('./data.txt', 'w')
        f.close()

    # start up server
    if (len(sys.argv) > 1):
        server = HTTPServer(('', int(sys.argv[1])), MyHandler)
        print("running server..")
        server.serve_forever()
    else:
        print("usage: python main.py <port> (e.g. python main.py 12345)")

if __name__ == '__main__':
    main()

