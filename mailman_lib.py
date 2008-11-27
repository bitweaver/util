from Mailman import mm_cfg
from Mailman.Errors import NotAMemberError

def setMemberModeratedFlag (mlist, addr):
    mlist.moderator.append(addr)
    mlist.Save()
    
