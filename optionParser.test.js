/** @format */

const OptionParser = require('./optionParser');

const args =
	'a -I/lib1 b -I=/lib2 -I /lib3 c -help -file/dev/null --filetype=txt -filetype cpp d';

describe('OptionParser testing', () => {
	let p = new OptionParser();
	p.addStringOption('I');
	p.addStringOption('f file');
	p.addStringOption('t filetype');
	p.addBoolOption('h help');
	p.addBoolOption('v version');
	let rest = p.parse(args.split(' '));

	test('Should return 4', () => {
		expect(rest.length).toEqual(4); // a b c d
		expect(rest.indexOf('a') !== -1).toBeTruthy();
		expect(rest.indexOf('b') !== -1).toBeTruthy();
		expect(rest.indexOf('c') !== -1).toBeTruthy();
		expect(rest.indexOf('d') !== -1).toBeTruthy();
		expect(rest.indexOf('e') !== -1).toBeFalsy();
	});

	test('Flags', () => {
		expect(p.isSet('file')).toBeTruthy();
		expect(p.isSet('f')).toBeTruthy();
		expect(p.isSet('help')).toBeTruthy();
		expect(p.isSet('filetype')).toBeTruthy();
		expect(p.isSet('I')).toBeTruthy();
		expect(p.isSet('version')).toBeFalsy();

		expect(p.isSet('fakeversion')).toBeFalsy();
	});

	test('The values of Flag', () => {
		let iOptions = p.getAll('I');
		expect(iOptions.indexOf('/lib1') !== -1).toBeTruthy();
		expect(iOptions.indexOf('/lib2') !== -1).toBeTruthy();
		expect(iOptions.indexOf('/lib3') !== -1).toBeTruthy();
		expect(iOptions.indexOf('/lib4') !== -1).toBeFalsy();

		expect('/dev/null').toEqual(p.get('file'));
		expect(p.get('fakefile')).toBeFalsy();

		let typeOptions = p.getAll('filetype');
		expect(typeOptions.length).toEqual(2);
		expect(typeOptions.indexOf('txt') !== -1).toBeTruthy();
		expect(typeOptions.indexOf('cpp') !== -1).toBeTruthy();
	});

	test('Resetting', () => {
		p.reset();
		expect(p.isSet('file')).toBeFalsy();
		expect(p.isSet('f')).toBeFalsy();
		expect(p.isSet('help')).toBeFalsy();
		expect(p.isSet('filetype')).toBeFalsy();
		expect(p.isSet('I')).toBeFalsy();
		expect(p.isSet('version')).toBeFalsy();
	});

	test('New args', () => {
		rest = p.parse('a b c -hv d'.split(' '));
		expect(rest.length).toEqual(4);

		expect(p.isSet('help')).toBeTruthy();
		expect(p.isSet('version')).toBeTruthy();
	});
	test('New args1', () => {
		p.reset();
		rest = p.parse('a b c -v d e -filetype=/lib'.split(' '));
		expect(rest.length).toEqual(5);

		expect(p.isSet('help')).toBeFalsy();
		expect(p.isSet('file')).toBeFalsy();
		expect(p.isSet('filetype')).toBeTruthy();
		expect(p.isSet('version')).toBeTruthy();
	});
});
