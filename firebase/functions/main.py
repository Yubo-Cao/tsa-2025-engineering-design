from firebase_functions import https_fn
from firebase_admin import initialize_app

initialize_app()

from cucumber import classify_cucumber
from melon import classify_melon
from tomato import classify_tomato
from rice import classify_rice
