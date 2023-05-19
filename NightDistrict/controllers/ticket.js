import Ticket from "../models/ticket.js"

const add = async (req, res) => {
    try{
        const saveTicket = {
            userId: req.body.id,
            eventId: req.body.eventid,
            paymentId: req.body.paymentid,
            type: req.body.type,
            quantity: req.body.quantity,
            ticketPrice: req.body.ticket_price,
            totalPrice: req.body.total_price
        }

        await Ticket(saveTicket).save();
        res.status(200).json("Ticket successfully added");
    }
    catch(err){
        res.status(500).json(err);
    }
}

export default {
    add
}