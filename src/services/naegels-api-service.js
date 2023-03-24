export default class NaegelsApi {

    _apiHost = 'http://127.0.0.1'
    _apiPort = '5002'
    _apiContext = '/api/v1'

    status(response) {  
        if (response.status >= 200 && response.status < 500) {  
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))  
        }
    }

    json(response) {  
        return response.json()  
    }

    apiCall = async(url, method='GET', data = '') => {

        if (!['GET','DELETE','POST','PUT'].includes(method)) {
            throw new Error(`Bad request method (${method})`);
        }
        
        const resourceLocation = `${this._apiHost}:${this._apiPort}${this._apiContext}${url}`
        var req = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        if(data !== ''){
            req.body = JSON.stringify(data)
        }
        const res = await fetch(
            resourceLocation,
            req
        );
        if(res.status >> 499) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`)
        }
        return await res.json({});
    };

    apiCallFormData = async(url, data) => {
        const resourceLocation = `${this._apiHost}:${this._apiPort}${this._apiContext}${url}`
        var req = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: data
        }
        const res = await fetch(
            resourceLocation,
            req
        );
        if(res.status >> 499) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`)
        }
        return await res.json({});
    }

    registerUser = async (email, username, password, repeatPassword, preferredLang) => {
        const data = {
            email: email,
            username: username,
            password: password,
            repeatPassword: repeatPassword,
            preferredLang: preferredLang
        };
        const res = await this.apiCall('/user', 'POST', data);
        return res
    };

    getUser = async (username) => {
        const res = await this.apiCall('/user/' + username, 'GET');
        return res
    };

    updateUser = async (username, token, email=null, aboutMe=null, preferredLang=null) => {
        const data = {
            username: username,
            token: token
        };
        if (email){
            data.email = email
        }
        if (aboutMe){
            data.aboutMe = aboutMe
        }
        if (preferredLang){
            data.preferredLang = preferredLang
        }
        const res = await this.apiCall('/user' + username, 'PUT', data);
        return res
    };

    login = async (username, password) => {
        if(!username){
            username = ''
        }
        if(!password){
            password = ''
        }
        const data = {
            username: username,
            password: password
        };
        const res = await this.apiCall('/user/token', 'POST', data);
        return res
    };

    getRooms = async (token, closed=false) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/room/all' + (closed ? '?closed=Y' : ''), 'POST', data);
        return res
    };

    createRoom = async (token, roomName) => {
        const data = {
            token: token,
            roomName: roomName
        };
        const res = await this.apiCall('/room', 'POST', data);
        return res
    };

    connectRoom = async (token, roomId) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/room/' + roomId + '/connect', 'POST', data);
        return res
    };

    closeRoom = async (token, roomId) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/room/' + roomId + '/close', 'POST', data);
        return res
    };

    getRoom = async (roomId) => {
        const res = await this.apiCall('/room/' + roomId);
        return res
    };

    disconnectRoom = async (token, roomId, username) => {
        const data = {
            token: token,
            username: username
        };
        const res = await this.apiCall('/room/' + roomId + '/disconnect', 'POST', data);
        return res
    };

    confirmReady = async (token, roomId, username) => {
        const data = {
            token: token,
            username: username
        };
        const res = await this.apiCall('/room/' + roomId + '/ready', 'POST', data);
        return res
    };

    resetReady = async (token, roomId, username) => {
        const data = {
            token: token,
            username: username
        };
        const res = await this.apiCall('/room/' + roomId + '/notready', 'POST', data);
        return res
    };

    startGame = async (token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/start', 'POST', data);
        return res
    };

    finishGame = async (token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/finish', 'POST', data);
        return res
    };

    getGame = async (gameId, token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId, 'POST', data);
        return res
    };

    dealCards = async (gameId, token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId + '/hand/deal', 'POST', data);
        return res
    };

    definePositions = async (gameId, token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId + '/positions', 'POST', data);
        return res
    };

    getCards = async (token, gameId, handId, burned=false) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId + '/hand/' + handId + '/cards?burned=' + (burned ? 'y' : 'n'), 'POST', data);
        return res
    };

    getHand = async (gameId, handId, token) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId + '/hand/' + handId, 'POST', data);
        return res
    };

    makeBet = async (token, gameId, handId, betSize) => {
        const data = {
            token: token,
            betSize: betSize
        };
        const res = await this.apiCall('/game/' + gameId + '/hand/' + handId + '/turn/bet', 'POST', data);
        return res
    };

    putCard = async (token, gameId, handId, cardId) => {
        const data = {
            token: token
        };
        const res = await this.apiCall('/game/' + gameId + '/hand/' + handId + '/turn/card/put/' + cardId, 'POST', data);
        return res
    };

    getInfo = async () => {
        const res = await this.apiCall('/info', 'GET')
        return res
    }

    getRules = async () => {
        const res = await this.apiCall('/rules', 'GET')
        return res
    }

    uploadProfilePic = async (token, username, img) => {
        const formData = new FormData();
        //formData.append('avatar', img)
        formData.append('token', token)
        const res = await this.apiCallFormData('/user/' + username + '/profilepic', formData)
        return res
    }
};

