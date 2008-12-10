from Mailman import mm_cfg
from Mailman.Errors import NotAMemberError
from Mailman.mm_cfg import Digests

def setMemberModeratedFlag (mlist, addr):
    mlist.moderator.append(addr)
    mlist.Save()

def setDefaultModerationFlag(mlist, val):
    mlist.default_member_moderation = int(val);
    for member in mlist.getMembers():
        mlist.setMemberOption(member, mm_cfg.Moderate, int(val))        
    mlist.Save()

def getSubscriptionType(mlist, addr):
    try:
        if mlist.getMemberOption(addr, Digests):
            print "digest"
        else:
            print "email"
    except NotAMemberError:
        print false

def setSubscriptionType(mlist, addr, val):
    mlist.setMemberOption(addr, mm_cfg.Digests, int(val))
    mlist.Save()

