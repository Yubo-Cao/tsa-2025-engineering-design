from firebase_admin import initialize_app
from firebase_functions.options import set_global_options, MemoryOption

initialize_app()
set_global_options(cpu=2, memory=MemoryOption.GB_2)

from cucumber import classify_cucumber
from melon import classify_melon
from rice import classify_rice
from tomato import classify_tomato
