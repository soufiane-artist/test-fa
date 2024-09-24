const router = require('express').Router()
const { newNotif, getverfyAccount, getChahada, getCoures } = require('../Controller/NotifC')
const { sendAmessageToAnAdmin, getAllMessage } = require('../Controller/sendMessage')


// send notif
router.post('/notif',newNotif)
// request verfy email service
router.post('/getverifyEmail',getverfyAccount)
// request chahada
router.post('/chahada',getChahada)
// send a message to an admin
router.post('/sendMessageAdmin',sendAmessageToAnAdmin)
router.get('/messages',getAllMessage)
// buy course
router.post('/course',getCoures)
module.exports = router