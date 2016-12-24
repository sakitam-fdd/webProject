L.network.Protocol.extend({
	protocol:    'pppoe',
	description: L.tr('protocol-type-pppoe'),
	tunnel:      false,
	virtual:     false,

	populateForm: function(section, iface)
	{
		//var map = this;
		//var iface = map.options.netIface;
		//var device = iface.getDevice();

		section.option(L.cbi.InputValue, 'username', {
			caption:     L.tr('PPPoE accout'),
			datatype:    'string',
			optional:    false
		});

		section.option(L.cbi.PasswordValue, 'password', {
			caption:     L.tr('PPPoE password'),
			optional:    false
		});

		section.option(L.cbi.InputValue, 'mtu', {
			caption:     L.tr('PPPoE MTU'),
			datatype:    'range(1, 9000)',
			//placeholder: device ? device.getMTU() : undefined,
			optional:    true
		});
	}
});
