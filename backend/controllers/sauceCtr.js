const modelSauce = require('../models/modelSauce');
const fs = require('fs');
const { model } = require('mongoose');
const { Console } = require('console');

//Create a sauce for the database
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    console.log(req.get('host'))
    const url = req.protocol + '://' + req.get('host'); 
    const newSauce = new modelSauce({
        name: req.body.sauce.name,
        description: req.body.sauce.description,
        manufacturer: req.body.sauce.manufacturer,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: [],
        usersDisliked: [],
        userId: req.body.sauce.userId
      });
    newSauce.save().then(
        () =>{
          res.status(201).json({
            message: 'Post saves successfully!'
          });
        }
    ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
    );
};

//Return one sauce from the database:
exports.getOneSauce = (req, res, next) => {
    modelSauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

//Modify the sauce on the database
exports.modifySauce = (req, res, next) => {
  let sauce = {};
  console.log(req.file);
  if (req.file) {
    modelSauce.findOne({_id: req.params.id})
    .then(asauce => {
      const name = asauce.imageUrl.split('/images/')[1];
      console.log("filename is: ", name);
      fs.unlink(`images/${name}`, (err) => {
        if(err) console.log(err)
        console.log("Former Picture deleted")
      })
    })
    .catch(error => res.status(500).json({error: error}))
    const sauceBody = JSON.parse(req.body.sauce)
    const url = req.protocol + '://' + req.get('host');
    sauce = {
      ...sauceBody,
      _id: req.params.id,
      imageUrl: url + '/images/' + req.file.filename,
    };
  } else {
    sauce = {
      ...req.body,
      _id: req.params.id,
    };
  }

    modelSauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
         res.status(201).json({
            message: 'Sauce updated successfully!'
         });
        }
    ).catch(
        (error) => {
         res.status(400).json({
            error: error
        });
        }
    );
    };
 
//Delete the sauce from the database
exports.deleteSauce = (req, res, next) => {
  modelSauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('No such thing!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        modelSauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    } 
  );
};

//Returns an array of all sauces in the database:
exports.getAllSauces = (req, res, next) => {
  modelSauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Increment or decrement the number of likes or dislikes in the database
exports.likeSauce = (req, res, next) => {
  console.log(req.params.id)
  let like = req.body.like;
  console.log("In like :", like)
  console.log('In like :', req.body.userId);
  let userId = req.body.userId;
  if(like === 1) {
    modelSauce.updateOne({
      _id: req.params.id
    }, {
      $push :{
        usersLiked: userId
      },
      $inc: { likes: +1 }
    })
    .then(() => res.status(200).json({message: "Sauce Liked"}))
    .catch(error => res.status(400).json(error))
  } else if (like === -1) {
    modelSauce.updateOne({
      _id: req.params.id
    }, {
      $push: {
        usersDisliked: userId
      },
      $inc: {dislikes: +1}
    })
    .then(() => res.status(200).json({message: "Sauce Disliked"}))
    .catch(error => res.status(400).json(error))

  } else if (like === 0) {
    modelSauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if(sauce.usersLiked.indexOf(userId) !== -1 /*&& sauce.findOne({usersLiked: userId})*/) {
        modelSauce.updateOne({
          _id: req.params.id
        }, {
          $pull: {
            usersLiked: userId
          },
          $inc: {likes: -1}
        })
        .then(() => res.status(200).json({message: "Sauce Liked Removed"}))
        .catch(error => res.status(400).json(error))
      } else if (sauce.usersDisliked.indexOf(userId) !== -1 /*&& sauce.findOne({usersDisliked: userId})*/) {
        modelSauce.updateOne({
          _id: req.params.id
        }, {
          $pull: {
            usersDisliked: userId
          },
          $inc: {dislikes: -1}
        })
        .then(() => res.status(200).json({message: "Sauce DisLiked Removed"}))
        .catch(error => res.status(400).json(error))
      }
    })
    .catch(error => res.status(400).json(error))
  }
}
