def run(media_folder, extension_folder, app):
    import os
    import json
    import requests
    from flask_cors import cross_origin
    from flask import request

    def is_valid_openai_key(openai_api_key) -> dict:
        url = "https://api.openai.com/v1/models"
        headers = {
            "Authorization": f"Bearer {str(openai_api_key)}"
        }
        response = requests.get(url, headers=headers)
        response_json = response.json()
        if response_json.get("error"):
            return {"error": response_json["error"]}
        else:
            return {}

    @app.route('/set_openai_key/', methods=["POST", "GET"])
    @cross_origin()
    def set_openai_key():
        file_path = os.path.join(extension_folder, "openai.key")

        if request.method == "POST":
            request_data = request.get_json()
            openai_api_key = request_data.get("openai_api_key")

            if openai_api_key:
                response_json = is_valid_openai_key(openai_api_key)

                if response_json.get("error"):
                    if app.config.get("OPENAI_API_KEY") is None:
                        app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                            "message": f"Ошибка, при авторизации ключа {response_json['error'].get('message')}"}
                        return {"openai_api_key": "Ошибка, при загрузке"}
                    else:
                        app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                            "message": f"Ошибка, при авторизации ключа. Ключ прежний {response_json['error'].get('message')}"}
                        return {"openai_api_key": f"Ошибка, при загрузке. Ключ прежний"}

                with open(file_path, "w") as file:
                    file.write(openai_api_key)
                app.config["OPENAI_API_KEY"] = openai_api_key  # load valid jey

        elif request.method == "GET" and app.config.get("OPENAI_API_KEY") is None:
            try:
                with open(file_path, "r") as file:
                    openai_api_key = file.read().strip()

                response_json = is_valid_openai_key(openai_api_key)

                if response_json.get("error"):
                    return {"openai_api_key": "Ключ не действителен"}
                app.config["OPENAI_API_KEY"] = openai_api_key  # load valid jey
            except FileNotFoundError:
                return {"openai_api_key": "Нет ключа"}

        return {"openai_api_key": "Ключ успешно загружен"}

    @app.route('/get_openai_dialog/', methods=["POST", "GET"])
    @cross_origin()
    def get_openai_dialog():
        if request.method == "POST":
            if app.config.get('OPENAI_API_KEY') is None:
                return [{"": ""}]

            app.config['SYSNTHESIZE_STATUS'] = {"status_code": 300,
                                                "message": "Подождите... Происходит генерация диалога"}

            request_list = request.get_json()  # get key

            thematic = request_list["thematic"]
            voices = request_list["voices"]
            question = "Напиши диалог не больше 1200 символов на русском языке. " + "Диалог о " + thematic + ". Диалог между " + ", ".join(
                voice for voice in voices) + ". Соблюдай формат list of dict [{here set name of speaker: here set text}, {name: text}]"

            if len(str(thematic)) == 0:
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200, "message": f"Введите тему для диалога"}
                return [{"": ""}]
            elif not voices:
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200, "message": f"Выберите хотя бы один голос"}
                return [{"": ""}]

            response_json = is_valid_openai_key(app.config["OPENAI_API_KEY"])

            if response_json.get("error"):
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                    "message": f"Произошла ошибка {response_json['error']}"}
                return [{"": ""}]

            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {app.config['OPENAI_API_KEY']}"
            }
            data = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": question}],
                "temperature": 0.7
            }

            try:
                response = requests.post(url, headers=headers, data=json.dumps(data))
                response_json = response.json()

                # Access the completion response
                completion = response_json["choices"][0]["message"]["content"]
                # Find the starting and ending positions of the list within the string
                start_pos = completion.find("[")
                end_pos = completion.rfind("]")

                # Extract the list substring from the response string
                completion = completion[start_pos : end_pos + 1]
                # Load json
                app.config['OPENAI_API_GENERATE_DIALOG'] = json.loads(completion)
                
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200, "message": ""}
            except Exception as e:
                app.config['OPENAI_API_GENERATE_DIALOG'] = ""
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200, "message": f"Произошла ошибка {e}"}

        if app.config.get('OPENAI_API_GENERATE_DIALOG') is None:
            return [{"": ""}]

        return app.config['OPENAI_API_GENERATE_DIALOG']

    @app.route('/get_openai_image/', methods=["POST", "GET"])
    @cross_origin()
    def get_openai_image():
        if request.method == "POST":
            if app.config.get('OPENAI_API_KEY') is None:
                return {"image": "", "prompt": ""}

            request_data = request.get_json()
            prompt = request_data.get("prompt")
            app.config['SYSNTHESIZE_STATUS'] = {"status_code": 300,
                                                "message": "Подождите... Происходит генерация изображения"}

            if len(str(prompt)) == 0:
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                    "message": f"Введите описание генерируемого изображения"}
                return {"image": "", "prompt": ""}

            response_json = is_valid_openai_key(app.config["OPENAI_API_KEY"])

            if response_json.get("error"):
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                    "message": f"Произошла ошибка {response_json['error']}"}
                return {"image": "", "prompt": prompt}

            try:
                url = "https://api.openai.com/v1/images/generations"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {app.config['OPENAI_API_KEY']}"
                }
                data = {
                    "prompt": f"{str(prompt)} look (forward on camera:1.1)",  # :TODO check (forward on camera:1.1)
                    "n": 1,
                    "size": "512x512",
                    "response_format": "b64_json",
                }

                response = requests.post(url, headers=headers, data=json.dumps(data))
                response_json = response.json()

                if response_json.get("error"):
                    app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200,
                                                        "message": f"Произошла ошибка {response_json['error']}"}
                    return {"image": "", "prompt": prompt}

                # Access the completion response
                app.config['OPENAI_API_GENERATE_IMAGE'] = {"image": response_json["data"][0]["b64_json"],
                                                           "prompt": prompt}
            except Exception as e:
                app.config['SYSNTHESIZE_STATUS'] = {"status_code": 200, "message": f"Произошла ошибка {e}"}
                return {"image": "", "prompt": prompt}

        if app.config.get('OPENAI_API_GENERATE_IMAGE') is None:
            return {"image": "", "prompt": ""}

        return app.config['OPENAI_API_GENERATE_IMAGE']
