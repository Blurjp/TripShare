# coding=utf-8
"""
This module contains config objects needed by paypal.interface.PayPalInterface.
Most of this is transparent to the end developer, as the PayPalConfig object
is instantiated by the PayPalInterface object.
"""
import logging
import os
from pprint import pformat

from paypal.exceptions import PayPalConfigError, PayPalError

logger = logging.getLogger('paypal.settings')

class PayPalConfig(object):
    """
    The PayPalConfig object is used to allow the developer to perform API
    queries with any number of different accounts or configurations. This
    is done by instantiating paypal.interface.PayPalInterface, passing config
    directives as keyword args.
    """
    # Used to validate correct values for certain config directives.
    _valid_= {
        'API_ENVIRONMENT' : ['sandbox','production'],
        'API_AUTHENTICATION_MODE' : ['3TOKEN','CERTIFICATE'],
    }

    # Various API servers.
    _API_ENDPOINTS= {
        # In most cases, you want 3-Token. There's also Certificate-based
        # authentication, which uses different servers, but that's not
        # implemented.
        '3TOKEN': {
            'sandbox' : 'https://svcs.sandbox.paypal.com/AdaptivePayments/',
            'production' : 'https://svcs.paypal.com/AdaptivePayments/',       
             }
        
    }

    _PAYPAL_URL_BASE= {
        #'sandbox' : 'https://www.sandbox.paypal.com/webscr',
        'sandbox' : 'https://www.sandbox.paypal.com/au/cgi-bin/webscr',
        'production' : 'https://www.paypal.com/webscr',
    }

    _APPLICATION_ID = {
                      'sandbox' : "APP-80W284485P519543T",
                      'production' :  "",
                       }

    API_VERSION = '72.0'

    # Defaults. Used in the absence of user-specified values.
    API_ENVIRONMENT = 'sandbox'
    API_AUTHENTICATION_MODE = '3TOKEN'

    # 3TOKEN credentials
    API_USERNAME = None
    API_PASSWORD = None
    API_SIGNATURE = None
    API_APPLICATION_ID = None
    # API Endpoints are just API server addresses.
    API_ENDPOINT = None
    PAYPAL_URL_BASE = None

    # API Endpoint CA certificate chain
    # (filename with path e.g. '/etc/ssl/certs/Verisign_Class_3_Public_Primary_Certification_Authority.pem')
    API_CA_CERTS = None
    
    # UNIPAY credentials
    UNIPAY_SUBJECT = None
    
    ACK_SUCCESS = "Success"
    ACK_SUCCESS_WITH_WARNING = "SuccessWithWarning"
    PAYMENT_CREATED_SUCCESS = "CREATED"
    PAYMENT_COMPLETED_SUCCESS = "COMPLETED"

    # In seconds. Depending on your setup, this may need to be higher.
    HTTP_TIMEOUT = 15

    def __init__(self, **kwargs):
        """
        PayPalConfig constructor. **kwargs catches all of the user-specified
        config directives at time of instantiation. It is fine to set these
        values post-instantiation, too.
        
        Some basic validation for a few values is performed below, and defaults
        are applied for certain directives in the absence of
        user-provided values.
        """
        if 'API_ENVIRONMENT' not in kwargs:
            kwargs['API_ENVIRONMENT']= self.API_ENVIRONMENT
        # Make sure the environment is one of the acceptable values.
        if kwargs['API_ENVIRONMENT'] not in self._valid_['API_ENVIRONMENT']:
            raise PayPalConfigError('Invalid API_ENVIRONMENT')
        self.API_ENVIRONMENT = kwargs['API_ENVIRONMENT']

        if 'API_AUTHENTICATION_MODE' not in kwargs:
            kwargs['API_AUTHENTICATION_MODE']= self.API_AUTHENTICATION_MODE
        # Make sure the auth mode is one of the known/implemented methods.
        if kwargs['API_AUTHENTICATION_MODE'] not in self._valid_['API_AUTHENTICATION_MODE']:
            raise PayPalConfigError("Not a supported auth mode. Use one of: %s" % \
                           ", ".join(self._valid_['API_AUTHENTICATION_MODE']))
        
        # Set the API endpoints, which is a cheesy way of saying API servers.
        self.API_ENDPOINT= self._API_ENDPOINTS[self.API_AUTHENTICATION_MODE][self.API_ENVIRONMENT]
        self.PAYPAL_URL_BASE= self._PAYPAL_URL_BASE[self.API_ENVIRONMENT]        
        self.API_APPLICATION_ID = self._APPLICATION_ID[self.API_ENVIRONMENT]
        # Set the CA_CERTS location
        if 'API_CA_CERTS' not in kwargs:
            kwargs['API_CA_CERTS']= self.API_CA_CERTS
        if kwargs['API_CA_CERTS'] and not os.path.exists(kwargs['API_CA_CERTS']):
            raise PayPalConfigError('Invalid API_CA_CERTS')
        self.API_CA_CERTS = kwargs['API_CA_CERTS']

        # set the 3TOKEN required fields
        if self.API_AUTHENTICATION_MODE == '3TOKEN':
            for arg in ('API_USERNAME','API_PASSWORD','API_SIGNATURE'):
                if arg not in kwargs:
                    raise PayPalConfigError('Missing in PayPalConfig: %s ' % arg)
                setattr(self, arg, kwargs[arg])
                
        for arg in ['HTTP_TIMEOUT']:
            if arg in kwargs:
                setattr(self, arg, kwargs[arg])

        logger.debug('PayPalConfig object instantiated with kwargs: %s' %
            pformat(kwargs))
