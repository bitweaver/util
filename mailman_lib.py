from Mailman import mm_cfg
from Mailman.Errors import NotAMemberError

def setMemberModeratedFlag (mlist, addr):
    mlist.moderator.append(addr)
    mlist.Save()

def setDefaultModerationFlag(mlist, val):
    mlist.default_member_moderation = int(val);
    for member in mlist.getMembers():
        mlist.setMemberOption(member, mm_cfg.Moderate, int(val))        
    mlist.Save()

