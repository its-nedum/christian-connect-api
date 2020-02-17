router.get('/feed', async (req, res) => {
    let userId = await getUserId(req);
    const Op = sequelize.Op

    // Filter Posts with friends 
    Friends.findAll({
        where:{
            [Op.or]:[{ requester_id: userId},{requestee_id: userId}],
            status: 'active' 

        }
    }).then((friends)=>{
        if(!friends){
            res.status(404).json({
                message: 'You have not made any connect'
            })
        }
        let userFriends = []
       friends.map(friend =>{
           userFriends.push(friend.requestee_id, friend.requester_id)
       })
       //Get userFriend firstname and lastname from users table
      Users.findAll({
          where:{ id: userFriends},
          attributes: ['id', 'firstname', 'lastname']
      }).then((users) => {
            if(!users){
                res.status(404).json({
                    message:'No posts were found for logged in user'
                })
            }else{
                //Get the user posts from the post table
                Posts.findAll({
                    where:{
                        owner_id: userFriends
                    },
                    order: ['id', 'DESC']
                }).then((posts) =>{
                 res.status(200).json({
                     message: "Post created succesfully", 
                     data: posts, //users friends post
                     user: users, //users friends firstname and lastname
                     friends: userFriends, //user friend ids
                 })
                }).catch((err) => {
                    res.status(500).json({
                        error: "Something went wrong, please try again later",
                        hint: err
                        })
                })
            }
      }).catch((err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
      }) 
       
    }).catch((err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
    })
});