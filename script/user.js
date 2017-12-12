module.exports = function (app, db) {
    app.post('/post/v1/addUser', (req, res) => {
        if (!(req.body.facebookID && req.body.preference)) {
            return res.status(400).send({
                err: -1,
                msg: 'Bad Request'
            });
        }
        db.collection('user').insertOne({
            _id: req.body.facebookID,
            preference: req.body.preference
        }, (err, result) => {
            if (err) {
                switch (err.code) {
                    case 11000:
                        return res.status(200).send({
                            err: 0,
                            msg: 'User Exist'
                        });
                    default:
                        return res.status(500).send(err);
                }
            }
            res.status(200).send('OK');
        });
    });

    app.post('/post/v1/removeUser', (req, res) => {
        if (!req.body.userID) {
            return res.status(400).send({
                err: -1,
                msg: 'Bad Request'
            });
        }
        db.collection('user').deleteOne({
            _id: ObjectID(req.body.userID)
        }, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send('OK');
        });
    });

    app.post('/post/v1/listUser', (req, res) => {
        db.collection('user').find({}).toArray().then(result => {
            for (let i = 0; i < result.length; i++) {
                result[i].userID = result[i]._id;
                delete result[i]._id;
            }
            res.status(200).send(result);
        });
    });
}