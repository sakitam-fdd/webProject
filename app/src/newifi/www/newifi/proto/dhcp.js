L.network.Protocol.extend({
	protocol:    'dhcp',
	description: L.tr('DHCP client'),
	tunnel:      false,
	virtual:     false,

	populateForm: function(section, iface)
	{
		section.option(L.cbi.DynamicList, 'dns', {
			caption:     L.tr('Custom DNS'),
			description: L.tr('Use custom DNS servers instead of DHCP ones'),
			datatype:    'ipaddr',
			optional:    true
		}).depends('peerdns', false);
	}
});
