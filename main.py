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
import re

XXX_SECRET_ID_XXX = str(random.random())

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
            
            if self.path == '/api/save/' + XXX_SECRET_ID_XXX:
                shutil.copy('data.txt', 'backup.txt')
                f = open('data.txt', 'w')
                f.write(postData)
                f.close()
            elif self.path == '/api/gmail/' + XXX_SECRET_ID_XXX:
                params = postData.split(',')
                pm = PimaMail(params[0], params[1])
                s = json.dumps(pm.getStars())
                pm.logout()
            elif self.path == '/api/gmail-removeStars/' + XXX_SECRET_ID_XXX:
                params = postData.split(',')
                pm = PimaMail(params[0], params[1])
                pm.removeStars(set(params[2:]))
                pm.logout()
            else:
                p = self.path
                if p == '/':
                    p = '/index.html'
                # limit the files that can be opened
                if not re.search(r"^(/data\.txt|/index\.html|/AES\.js|u_new\.js)$", p):
                    raise BaseException("access denied")
                f = open('.' + p)
                s = f.read()
                s = s.replace('XXX_SECRET_ID_XXX', XXX_SECRET_ID_XXX)
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
    # ensure existence of data.txt
    try:
        f = open('./data.txt')
    except:
        f = open('./data.txt', 'w')
        f.close()

    # start up server
    port = 12345
    server = HTTPServer(('', port), MyHandler)
    print("running server at localhost:" + str(port))
    server.serve_forever()

if __name__ == '__main__':
    main()
