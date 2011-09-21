import email, string, re

from email.parser import HeaderParser

class GmailMessages:
    
    def __init__(self, gmail_server):
        self.server = gmail_server
        self.mailbox = None
        self.messages = list()
    
    def parseFlags(self, flags):
        return flags.split() # Note that we don't remove the '\' from flags, just split by space
    
    def parseMetadata(self, entry):
        if(not getattr(self,'metadataExtracter',False) ): #Lazy initiation of the parser
            self.metadataExtracter = re.compile(r'(?P<id>\d*) \(X-GM-THRID (?P<gmailThreadId>\d*) X-GM-MSGID (?P<gmailId>\d*) UID (?P<uid>\d*) FLAGS \((?P<flags>.*)\)\s')
            # I hate regexps.
            # (\d*) = MSG ID, the position index of the message in its mailbox
            # \(UID (\d*) = MSG UID, the unique id of this message within its mailbox
            # FLAGS \((.*)\)\s = MSG FLAGS, special indicators like (\Starred, \Seen) may be empty
                    #example: 55 (UID 82 FLAGS (\Seen) BODY[HEADER.FIELDS (SUBJECT FROM)] {65}
                    # groupdict() = { id:'55', uid:'82', flags:'\\Seen' }
        
        metadata = self.metadataExtracter.match(entry).groupdict()
        metadata['flags'] = self.parseFlags(metadata['flags'])
        return metadata
    
    def parseHeaders(self,entry):
        if(not getattr(self,'headerParser',False) ):
            self.headerParser = HeaderParser() #See http://docs.python.org/library/email.parser.html#parser-class-api
        
        headers = self.headerParser.parsestr(entry)
        return headers
    
    def process(self, mailbox, flags='(UNDELETED)', readonly=True):
        self.mailbox = mailbox
        self.messages = list()
        
        result, message = self.server.imap_server.select(mailbox,readonly=readonly)
        if result != 'OK':
            raise Exception, message
        
        typ, data = self.server.imap_server.search(None, flags)
        fetch_list = string.split(data[0])# limit to N most recent messages in mailbox, this is where pagination should be implemented
        fetch_list = ','.join(fetch_list)
        
        if(fetch_list):
            f = self.server.imap_server.fetch(fetch_list, '(X-GM-MSGID X-GM-THRID UID FLAGS BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')
            for fm in f[1]:
                if(len(fm)>1):
                    metadata = self.parseMetadata(fm[0]) #metadata is contained
                    headers = self.parseHeaders(fm[1])
                    
                    message = {}
                    message['gmailId'] = "%x" % int(metadata['gmailId'])
                    message['gmailThreadId'] = "%x" % int(metadata['gmailThreadId'])
                    message['id'] = metadata['id']
                    message['uid'] = metadata['uid']
                    message['flags'] = metadata['flags']
                    message['mailbox'] = mailbox
                    message['date'] = headers['Date']
                    message['from'] = headers['From']
                    if( 'Subject' in headers ):
                        message['subject'] = headers['Subject']
                        
                    self.messages.append(message)
                    
    def getMessage(self, uid):
        status, data = self.server.imap_server.uid('fetch',uid, 'RFC822')
        messagePlainText = ''
        messageHTML = ''
        for response_part in data:
            if isinstance(response_part, tuple):
                msg = email.message_from_string(response_part[1])
                for part in msg.walk():
                    if str(part.get_content_type()) == 'text/plain':
                        messagePlainText = messagePlainText + str(part.get_payload())
                    if str(part.get_content_type()) == 'text/html':
                        messageHTML = messageHTML + str(part.get_payload())
        if(messagePlainText != '' ):
            return messagePlainText
        else:
            return messageHTML

