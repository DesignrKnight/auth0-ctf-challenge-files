from flask import Blueprint, request, render_template, render_template_string
import json

web = Blueprint('web', __name__)
api = Blueprint('api', __name__)

@web.route('/')
def index():
    return render_template('index.html')

@api.route('/enroll', methods=['POST'])
def submit():
    if any(x in str(request.data) for x in ['{{', '{%']):
        return render_template_string('Invalid email! 😖 please try again!')
    
    enrollment = json.loads(request.get_data()).get('email', '')

    if enrollment:
        return render_template_string('The email %s is subscribed! 🥳' % enrollment)
    
    return 'Something went wrong'