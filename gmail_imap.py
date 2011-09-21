import imaplib
import gmail_messages

class GmailImap:

    def __init__ (self, username, password):
        self.username = username
        self.password = password
        self.imap_server = imaplib.IMAP4_SSL("imap.gmail.com",993)
        self.imap_server.login(self.username,self.password)
        
        self.messages = gmail_messages.GmailMessages(self)
    
    def logout (self):
        self.imap_server.close()
        self.imap_server.logout()
