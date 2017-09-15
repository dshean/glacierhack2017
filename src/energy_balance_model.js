// Development/testing space to write functions for energy balance model
// Functions based on Rounce & McKinney (2017) methods

var testimage = ee.Image(NCEP_data.first());
print(testimage, 'NCEP single image');

// Filter imagery down to Khumbu Glacier

// var rgi_outlines = ee.FeatureCollection(rgi60_15);
// // Select the Khumbu glacier
// var rgi_roi = rgi_outlines.filterMetadata('RGIId', 'equals', 'RGI60-15.03733');
// var NCEP_data = NCEP_collection
// // Filter to get only images around region of interest.
//     .filterBounds(rgi_roi)
//     // Filter to get only one year of images.
//     .filterDate('2014-05-15', '2016-10-15')
//     // Filter by month
//     .filter(ee.Filter.dayOfYear(135,288))

// User defined constants
var albedo = ee.Number(0.3);
var emissivity = ee.Number(0.95);
var stefboltz = ee.Number(5.67E-8); // W m-2 K-4
var vonKarman = ee.Number(0.41);
var z_met = ee.Number(2); // height of meteorological measurements, m
var z0 = ee.Number(0.016); // surface roughness length
var Ts = ee.Number(280); // ballpark surface temperature, K
var Gratio = ee.Number(2.7); // nonlinear approximation factor for heat flux
var keff = ee.Number(0.96); // average effective thermal conductivity of rock, W m-1 K-1
var pair = ee.Number(1.29); // density of air, kg m-3
var P0 = ee.Number(101325); // atmospheric pressure at sea level, Pa
var cair = ee.Number(1010); // Specific heat capacity of air, J kg-1 K-1

// Calculate net radiation flux (W m-2)
// Rn = SWR(1-a) + e(LWR - (sig*Ts^4))
var net_radiation_flux = function(image) {
  return ee.Image(0).expression(
    'SWR * (1 - a) + (e * (LWR - (sb * (Ts**4))))',
    {
      'SWR': image.select('Downward_Short-Wave_Radiation_Flux_surface_6_Hour_Average'),
      'LWR': image.select('Downward_Long-Wave_Radp_Flux_surface_6_Hour_Average'),
      'Ts': Ts, // ballpark, K
      'a': albedo,
      'e': emissivity,
      'sb': stefboltz
    }).select(['Downward_Short-Wave_Radiation_Flux_surface_6_Hour_Average'],['net_radiation_flux']);
};

// Calculate dimensionless transfer coefficient
// A = (vonKarman^2) / ln(z/z0)*ln(z/z0)
var transfer_coeff = vonKarman.multiply(vonKarman).divide((z_met.divide(z0)).log().multiply(z_met.divide(z0).log()));
print(transfer_coeff, 'Transfer coefficient');

// Calculate sensible heat flux (W m-2)
// H = pair(P/P0)cAu(Tair-Ts)
var sensible_heat_flux = function(image) {
  return ee.Image(0).expression(
    'pair * (P / P0) * c * A * u * (Tair - Ts)',
    {
      'pair': pair, // Density of air, kg m-3
      'P': image.select('Pressure_surface'), // Atmospheric pressure
      'P0': P0, // Atmospheric pressure at sea level, Pa
      'c': cair, // Specific heat capacity of air, J kg-1 K-1
      'A': transfer_coeff, // Dimensionless transfer coefficient
      'u': image.select('u-component_of_wind_height_above_ground').hypot(image.select('v-component_of_wind_height_above_ground')), // Wind speed
      'Tair': image.select('Temperature_height_above_ground'), // Air temperature 2m above surface
      'Ts': Ts, // Surface temperature, K
    }).select(['constant'],['sensible_heat_flux']);
};

// Calculate debris thickness (m) using nonlinear model for ground heat flux
// d = Gratio * keff(Ts-273.15)/ (Rn + H) where Rn+H=Qc, ground heat flux, W m-2
var debris_thickness = function(image) {
  return ee.Image(0).expression(
    'Gratio * keff * (Ts - 273.15) / (Rn + H)',
    {
      'Gratio': Gratio, // Nonlinear approximation factor
      'keff': keff, // Effective thermal conductivity, W m-1 K-1
      'Ts': Ts, // Surface temperature, K
      'Rn': net_radiation_flux(image), // Net radiation flux, W m-2
      'H': sensible_heat_flux(image) // Sensible heat flux, W m-2
    }).select(['constant'],['debris_thickness']);
};

// var dt = NCEP_data.limit(5).map(debris_thickness); // this displays dt as a recent-value composite :(


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Trying to add images to map...
var multiband_results = function(image) {
  return ee.Image([net_radiation_flux(image), sensible_heat_flux(image), debris_thickness(image)]);
};
print(NCEP_data.limit(5).map(multiband_results), 'Multiband results');

// var display_thickness = function(image) {
//   return multiband_results(image).select('debris_thickness');
// };
// NCEP_data.limit(5).map(display_thickness); // THIS DOESN'T WORK
// Map.addLayer(multiband_results(testimage).select('debris_thickness')); // THIS ADDS ONE IMAGE
// Map.addLayer(NCEP_data.limit(5).map(multiband_results)) // THIS ADDS ONE IMAGE, WRONG BAND
// Map.addLayer(NCEP_data.limit(5).map(display_thickness));

var img_output = ee.Image([net_radiation_flux(testimage),sensible_heat_flux(testimage),debris_thickness(testimage)]);
print(img_output);
Map.addLayer(img_output.select('debris_thickness'), {}, 'Debris thickness');

// var listOfImages = NCEP_data.limit(5).map(display_thickness).toList(20).getInfo();

// print(listOfImages);

// for (var i = 0; i <listOfImages.length; i++) {
//   var img = listOfImages[i];
//   Map.addLayer(ee.Image(img.id),{},img.id);
// }