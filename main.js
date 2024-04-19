const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdthumb = $('.cd-thumb');
const audio = $('.audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const volumeBar = $('.volume-bar')
const muteIcon = $('.icon-mute')
const unmuteIcon = $('.icon-unmute')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentVolume: 1,
    savedVolume: 1,
    config: {},
    //   (1/2) Uncomment the line below to use localStorage
    //   config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Da Da Da",
            singer: "Mikis Remix DJ",
            path: "./assets/music/dadada.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/09/20/2/2/5/5/1695200678323.jpg"
        },
        {
            name: "See you again",
            singer: "Kurt Hugo Schneider, Eppic, Alex Goot",
            path: "./assets/music/seeyouagain.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/03/23/3/e/3/6/1679559159635.jpg"
        },
        {
            name: "The Spectre",
            singer: "Alan Walker",
            path: "./assets/music/thespectre.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/mv/2017/09/15/8/0/a/2/1505460794038_268.jpg"
        },
        {
            name: "Faded",
            singer: " Alan Walker, Iselin Solheim",
            path: "./assets/music/faded.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/mv/2016/04/05/8/5/6/0/1459846639845_268.jpg"
        },
        {
            name: "Sing Me To Sleep",
            singer: "Alan Walker",
            path: "./assets/music/singmetosleep.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/mv/2016/06/03/6/2/c/e/1464927555680_268.jpg"
        },
        {
            name: "Haru Haru",
            singer: "BingBang",
            path: "./assets/music/haruharu.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2020/06/09/2/d/0/7/1591688793624.jpg"
        },
        {
            name: "Suýt nữa thì",
            singer: "Andiez",
            path: "./assets/music/suytnuathi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2018/07/19/6/0/9/e/1532010326915.jpg"
        },
        {
            name: "Giúp anh trả lời những câu hỏi",
            singer: "Vương Anh Tú",
            path: "./assets/music/giupanhtraloinhungcauhoi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/04/20/e/4/0/a/1682004968585.jpg"
        },
        {
            name: "Thu cuối",
            singer: "Yanbi, Hằng BingBoong, MrT",
            path: "./assets/music/thucuoi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/09/20/2/2/5/5/1695201951760.jpg"
        },
        {
            name: "Xứng đôi cưới thôi",
            singer: "Lê Thiện Hiếu",
            path: "./assets/music/xungdoicuoithoi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2019/06/28/7/b/d/d/1561696223026.jpg"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    }
    ,
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdthumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }; 

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        //Khi song được play
        audio.onplay = function (){
            audio.volume = app.savedVolume;
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        //Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        //Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        //Xử lý khi tua song
        //Xử lý khi click vào nút tua bài hát
        progress.oninput = function () {
            const progressValue = progress.value;
            const currentTime = (audio.duration * progressValue) / 100;
            audio.currentTime = currentTime;
        };
        //Khi next song
        nextBtn.onclick = function () {
            audio.volume = app.savedVolume;
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //Khi prev song
        prevBtn.onclick = function () {
            audio.volume = app.savedVolume;
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            app.isRandom = !app.isRandom;
            app.setConfig("isRandom", app.isRandom);
            randomBtn.classList.toggle("active", app.isRandom);
            //Thêm lớp màu sắc khi bật/tắt chế độ ngẫu nhiên
            if (app.isRandom) {
                randomBtn.style.color = "var(--primary-color)";
                //Đảm bảo nút lặp lại không được bật
                app.isRepeat =  false;
                app.setConfig("isRepeat", app.isRepeat);
                repeatBtn.classList.remove("active");
                repeatBtn.style.color = "inherit";
            } else{
                randomBtn.style.color = "inherit";
            }
        };

        //Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            app.isRepeat = !app.isRepeat;
            app.setConfig("isRepeat", app.isRepeat);
            repeatBtn.classList.toggle("active", app.isRepeat);
            //Thêm lớp màu sắc khi bật/tắt chế độ lặp lại
            if (app.isRepeat) {
                repeatBtn.style.color = "var(--primary-color)";
                //Đảm bảo nút ngẫu nhiên không được bật
                app.isRandom = false;
                app.setConfig("isRandom", app.isRandom);
                randomBtn.classList.remove("active");
                randomBtn.style.color = "inherit";
            }else{
                repeatBtn.style.color = "inherit";
            }
        };
        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat){
                audio.play();
            } else{
                nextBtn.click();
            }
        };
        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                //Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xử lý khi click vào song option
                if (e.target.closest(".option")) {

                }
            }
        }; 
        //Xử lý volume
        let isTouchingVolume = false;
        volumeBar.addEventListener("touchstart", (e) => {
            isTouchingVolume = true;
        }, {pasive: false});
        document.addEventListener("touchmove", (e) => {
            if (isTouchingVolume) {
                e.preventDefault(); // ngăn cuôn trang khi chuyển ngon tay
            }
        });
        document.addEventListener('touchend', (e) => {
            isTouchingVolume = false;
        });

        //Xử lý khi click vào nút volume
        if (_this.currentVolume > 0) {
            volumeBar.value = _this.currentVolume;
            audio.volume = _this.currentVolume;
            $('.icon-unmute').style.visibility = 'visible';
            $('.icon-mute').style.visibility = 'hidden';
        } else {
            volumeBar.value = 0;
            audio.volume = 0;
            $('.icon-unmute').style.visibility = 'hidden';
            $('.icon-mute').style.visibility = 'visible';
        }
        audio.onvolumechange = () => {
            volumeBar.value = audio.volume;
            if (audio.volume === 0) {
                muteIcon.style.visibility = 'visible';
                unmuteIcon.style.visibility = 'hidden';
            } else {
                muteIcon.style.visibility = 'hidden';
                unmuteIcon.style.visibility = 'visible';
            }
        }
        volumeBar.oninput = e => {
            this.setConfig('curentVolume', e.target.value)
            audio.volume = volumeBar.value;
            volumeBar.setAttibute('title', 'Âm lượng' + volumeBar.value * 100 + "%");
        }
        unmuteIcon.onclick = e => {
            this.setConfig('savedVolume', audio.volume);
            audio.volume = 0;
            this.setConfig('currentVolume', audio.volume);
        }
        muteIcon.onclick = e => {
            audio.volume = this.config.savedVolume;
            this.setConfig('currentVolume', audio.volume);
        }
    },
    scrollToActiveSong: function () {
        const activeSong = $(".song.active");
        if (activeSong) {
            setTimeout(() => {
                activeSong.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }, 300);
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;         
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentVolume = this.config.curentVolume;
    },
    nextSong: function () {
        if (this.isRandom) {
            this.playRandomSong();
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        }
    },
    prevSong: function () {
        if (this.isRandom) {
            this.playRandomSong();
        } else {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        }
    },
    playedSongs: []
    ,
    playRandomSong: function () {
        // Kiểm tra nếu đã phát đủ tất cả các bài hát
        if (this.playedSongs.length === this.songs.length) {
            // Xóa mảng để bắt đầu lại từ đầu
            this.playedSongs = [];
        }

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(this.playedSongs.includes(newIndex)); // Kiểm tra chỉ mục đã được phát chưa

        // Thêm chỉ mục mới vào mảng
        this.playedSongs.push(newIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        //// Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        // Defines properties for the object
        this.defineProperties();
        
        // Lắng nghe / xử lý các sự kiện (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

         // Thiết lập giá trị volume thành 100
        this.currentVolume = 1; // hoặc this.currentVolume = 100;
         // Kiểm tra xem audio đã được tải chưa trước khi cập nhật giá trị volume
        if (audio.readyState >= 2) {
            audio.volume = this.currentVolume;
        } else {
            audio.onloadedmetadata = () => {
            audio.volume = this.currentVolume;
        };
    }
        // Render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
}

app.start();
