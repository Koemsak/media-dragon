
const PORT = 3000;
const URL_REQUEST = "https://media-dragon.herokuapp.com";

new Vue ({
    el: "#app",
    delimiters: ["{{", "}}"],
    data: {
        lists: [],
        author: "",
        isLogin: false,
        description: "",
        img: "",
        URL: URL_REQUEST,
        currentAuthor: "",
        updateDelete: true,
        getId: 0,
        getName: "",
        isNotOwnUser: false,
        folderImg: [],
        getImg: ""
    },
    methods: {
        createClick: function() {
            this.description = "";
            this.updateDelete = true;
            this.img = "";
        },
        userLogin: function() {
            this.isLogin = true;
            localStorage.setItem("author", this.author);
            localStorage.setItem("logined", this.isLogin);
            this.currentAuthor = localStorage.getItem("author");
            this.author = "";
        },
        userLogout: function() {
            this.isLogin = false;
            localStorage.setItem("logined", this.isLogin);
        },
        getImage(event) {
            event.preventDefault();
            let imgFileName = event.target.files[0];
            if (imgFileName !== undefined) {
                this.img=URL.createObjectURL(imgFileName);
                this.folderImg.push(URL.createObjectURL(imgFileName));
            }
            console.log(this.img);
        },
        addInformation: function() {
            if (this.description !== "") {
                let author_name = localStorage.getItem("author");
                let today = new Date();
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                let date = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
                let time = today.getHours() + ":" + today.getMinutes();
                let dateTime = date + ", " + time;
                let text = this.description;

                let data = {
                    author: author_name,
                    date: dateTime,
                    description: text,
                    image: this.img
                }
                axios.post(this.URL + "/posts", data).then((response) => {
                    this.lists = response.data;
                })
                this.updateDelete = true
            }
        },
        deleteList(list) {
            let id = list.id;
            this.updateDelete = true;
            axios.delete(this.URL + "/posts/" + id).then((response) => {
                this.lists = response.data;
            })
        },
        editList(list) {
            this.updateDelete = false;
            this.getId = list.id;
            this.description = list.description; 
            this.getName = list.author;  
            this.getImg = list.image; 
        },
        updateList() {
            let today = new Date();
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            let date = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
            let time = today.getHours() + ":" + today.getMinutes();
            let dateTime = date + ", " + time;

            let id = this.getId;
            
            let new_inof = {
                id: id,
                author: this.getName,
                date: dateTime,
                description: this.description,
                image: this.getImg
            }
            // let id = this.getId;
            axios.put(this.URL + "/posts/" + id, new_inof).then((response) => {
                this.lists = response.data;
            })
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            axios.get(this.URL + "/posts").then((response) => {
                this.lists = response.data;
            })
            this.currentAuthor = localStorage.getItem("author");
            this.isLogin = localStorage.getItem("logined");
        })
    }
})