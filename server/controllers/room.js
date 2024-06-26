import Room from '../schemas/room.js';

export const findRoom = async (req, res)=>{
    // room id
    const _id = req.params.roomId;
    const room = await Room.findOne({_id});
    res.status(200).json({
        _id: room._id,
        name: room.name,
        master: room.master
    });
}