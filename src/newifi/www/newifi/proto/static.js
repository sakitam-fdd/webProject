L.network.Protocol.extend({
	protocol:    'static',
	description: L.tr('Static address'),
	tunnel:      false,
	virtual:     false,

	_ev_broadcast: function(ev)
	{
		var self = ev.data.self;
		var sid = ev.data.sid;

		var i = ($('#' + self.ownerSection.id('field', sid, 'ipaddr')).val() || '').split(/\./);
		var m = ($('#' + self.ownerSection.id('field', sid, 'netmask') + ' select').val() || '').split(/\./);

		var I = 0;
		var M = 0;

		for (var n = 0; n < 4; n++)
		{
			i[n] = parseInt(i[n]);
			m[n] = parseInt(m[n]);

			if (isNaN(i[n]) || i[n] < 0 || i[n] > 255 ||
				isNaN(m[n]) || m[n] < 0 || m[n] > 255)
				return;

			I |= (i[n] << ((3 - n) * 8));
			M |= (m[n] << ((3 - n) * 8));
		}

		var B = I | ~M;

		$('#' + self.section.id('field', sid, 'broadcast'))
			.attr('placeholder', '%d.%d.%d.%d'.format(
				(B >> 24) & 0xFF, (B >> 16) & 0xFF,
				(B >>  8) & 0xFF, (B >>  0) & 0xFF
			));
	},

	populateForm: function(section, iface)
	{
		var device = L.network.getDeviceByInterface(iface);

		section.option(L.cbi.InputValue, 'ipaddr', {
			caption:  L.tr('IPv4 address'),
			datatype: 'ip4addr',
			optional: true
		}).on('blur validate', this._ev_broadcast);

		section.option(L.cbi.ComboBox, 'netmask', {
			caption:  L.tr('IPv4 netmask'),
			datatype: 'ip4addr',
			optional: true
		}).on('blur validate', this._ev_broadcast)
			.value('255.255.255.0')
			.value('255.255.0.0')
			.value('255.0.0.0');

		section.option(L.cbi.InputValue, 'gateway', {
			caption:  L.tr('IPv4 gateway'),
			datatype: 'ip4addr',
			optional: true
		});

		section.option(L.cbi.DynamicList, 'dns', {
			caption:  L.tr('DNS servers'),
			datatype: 'ipaddr',
			optional: true
		});
	}
});
