"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";

/* ── types ─────────────────────────────────────────────── */
type Status = "idle" | "submitting" | "success";
interface Props { isOpen: boolean; onClose: () => void; }

/* ── country codes (full world list) ─────────────────────── */
const COUNTRIES = [
  // ── Top picks (shown first) ──
  { code: "IN", flag: "🇮🇳", dial: "+91",    name: "India" },
  { code: "US", flag: "🇺🇸", dial: "+1",     name: "United States" },
  { code: "GB", flag: "🇬🇧", dial: "+44",    name: "United Kingdom" },
  { code: "AE", flag: "🇦🇪", dial: "+971",   name: "UAE" },
  { code: "SG", flag: "🇸🇬", dial: "+65",    name: "Singapore" },
  { code: "AU", flag: "🇦🇺", dial: "+61",    name: "Australia" },
  { code: "CA", flag: "🇨🇦", dial: "+1",     name: "Canada" },
  // ── A ──
  { code: "AF", flag: "🇦🇫", dial: "+93",    name: "Afghanistan" },
  { code: "AL", flag: "🇦🇱", dial: "+355",   name: "Albania" },
  { code: "DZ", flag: "🇩🇿", dial: "+213",   name: "Algeria" },
  { code: "AD", flag: "🇦🇩", dial: "+376",   name: "Andorra" },
  { code: "AO", flag: "🇦🇴", dial: "+244",   name: "Angola" },
  { code: "AG", flag: "🇦🇬", dial: "+1268",  name: "Antigua & Barbuda" },
  { code: "AR", flag: "🇦🇷", dial: "+54",    name: "Argentina" },
  { code: "AM", flag: "🇦🇲", dial: "+374",   name: "Armenia" },
  { code: "AT", flag: "🇦🇹", dial: "+43",    name: "Austria" },
  { code: "AZ", flag: "🇦🇿", dial: "+994",   name: "Azerbaijan" },
  // ── B ──
  { code: "BS", flag: "🇧🇸", dial: "+1242",  name: "Bahamas" },
  { code: "BH", flag: "🇧🇭", dial: "+973",   name: "Bahrain" },
  { code: "BD", flag: "🇧🇩", dial: "+880",   name: "Bangladesh" },
  { code: "BB", flag: "🇧🇧", dial: "+1246",  name: "Barbados" },
  { code: "BY", flag: "🇧🇾", dial: "+375",   name: "Belarus" },
  { code: "BE", flag: "🇧🇪", dial: "+32",    name: "Belgium" },
  { code: "BZ", flag: "🇧🇿", dial: "+501",   name: "Belize" },
  { code: "BJ", flag: "🇧🇯", dial: "+229",   name: "Benin" },
  { code: "BT", flag: "🇧🇹", dial: "+975",   name: "Bhutan" },
  { code: "BO", flag: "🇧🇴", dial: "+591",   name: "Bolivia" },
  { code: "BA", flag: "🇧🇦", dial: "+387",   name: "Bosnia & Herzegovina" },
  { code: "BW", flag: "🇧🇼", dial: "+267",   name: "Botswana" },
  { code: "BR", flag: "🇧🇷", dial: "+55",    name: "Brazil" },
  { code: "BN", flag: "🇧🇳", dial: "+673",   name: "Brunei" },
  { code: "BG", flag: "🇧🇬", dial: "+359",   name: "Bulgaria" },
  { code: "BF", flag: "🇧🇫", dial: "+226",   name: "Burkina Faso" },
  { code: "BI", flag: "🇧🇮", dial: "+257",   name: "Burundi" },
  // ── C ──
  { code: "CV", flag: "🇨🇻", dial: "+238",   name: "Cabo Verde" },
  { code: "KH", flag: "🇰🇭", dial: "+855",   name: "Cambodia" },
  { code: "CM", flag: "🇨🇲", dial: "+237",   name: "Cameroon" },
  { code: "CF", flag: "🇨🇫", dial: "+236",   name: "Central African Rep." },
  { code: "TD", flag: "🇹🇩", dial: "+235",   name: "Chad" },
  { code: "CL", flag: "🇨🇱", dial: "+56",    name: "Chile" },
  { code: "CN", flag: "🇨🇳", dial: "+86",    name: "China" },
  { code: "CO", flag: "🇨🇴", dial: "+57",    name: "Colombia" },
  { code: "KM", flag: "🇰🇲", dial: "+269",   name: "Comoros" },
  { code: "CG", flag: "🇨🇬", dial: "+242",   name: "Congo" },
  { code: "CD", flag: "🇨🇩", dial: "+243",   name: "Congo (DRC)" },
  { code: "CR", flag: "🇨🇷", dial: "+506",   name: "Costa Rica" },
  { code: "HR", flag: "🇭🇷", dial: "+385",   name: "Croatia" },
  { code: "CU", flag: "🇨🇺", dial: "+53",    name: "Cuba" },
  { code: "CY", flag: "🇨🇾", dial: "+357",   name: "Cyprus" },
  { code: "CZ", flag: "🇨🇿", dial: "+420",   name: "Czech Republic" },
  // ── D ──
  { code: "DK", flag: "🇩🇰", dial: "+45",    name: "Denmark" },
  { code: "DJ", flag: "🇩🇯", dial: "+253",   name: "Djibouti" },
  { code: "DM", flag: "🇩🇲", dial: "+1767",  name: "Dominica" },
  { code: "DO", flag: "🇩🇴", dial: "+1809",  name: "Dominican Republic" },
  // ── E ──
  { code: "EC", flag: "🇪🇨", dial: "+593",   name: "Ecuador" },
  { code: "EG", flag: "🇪🇬", dial: "+20",    name: "Egypt" },
  { code: "SV", flag: "🇸🇻", dial: "+503",   name: "El Salvador" },
  { code: "GQ", flag: "🇬🇶", dial: "+240",   name: "Equatorial Guinea" },
  { code: "ER", flag: "🇪🇷", dial: "+291",   name: "Eritrea" },
  { code: "EE", flag: "🇪🇪", dial: "+372",   name: "Estonia" },
  { code: "SZ", flag: "🇸🇿", dial: "+268",   name: "Eswatini" },
  { code: "ET", flag: "🇪🇹", dial: "+251",   name: "Ethiopia" },
  // ── F ──
  { code: "FJ", flag: "🇫🇯", dial: "+679",   name: "Fiji" },
  { code: "FI", flag: "🇫🇮", dial: "+358",   name: "Finland" },
  { code: "FR", flag: "🇫🇷", dial: "+33",    name: "France" },
  // ── G ──
  { code: "GA", flag: "🇬🇦", dial: "+241",   name: "Gabon" },
  { code: "GM", flag: "🇬🇲", dial: "+220",   name: "Gambia" },
  { code: "GE", flag: "🇬🇪", dial: "+995",   name: "Georgia" },
  { code: "DE", flag: "🇩🇪", dial: "+49",    name: "Germany" },
  { code: "GH", flag: "🇬🇭", dial: "+233",   name: "Ghana" },
  { code: "GR", flag: "🇬🇷", dial: "+30",    name: "Greece" },
  { code: "GD", flag: "🇬🇩", dial: "+1473",  name: "Grenada" },
  { code: "GT", flag: "🇬🇹", dial: "+502",   name: "Guatemala" },
  { code: "GN", flag: "🇬🇳", dial: "+224",   name: "Guinea" },
  { code: "GW", flag: "🇬🇼", dial: "+245",   name: "Guinea-Bissau" },
  { code: "GY", flag: "🇬🇾", dial: "+592",   name: "Guyana" },
  // ── H ──
  { code: "HT", flag: "🇭🇹", dial: "+509",   name: "Haiti" },
  { code: "HN", flag: "🇭🇳", dial: "+504",   name: "Honduras" },
  { code: "HU", flag: "🇭🇺", dial: "+36",    name: "Hungary" },
  // ── I ──
  { code: "IS", flag: "🇮🇸", dial: "+354",   name: "Iceland" },
  { code: "ID", flag: "🇮🇩", dial: "+62",    name: "Indonesia" },
  { code: "IR", flag: "🇮🇷", dial: "+98",    name: "Iran" },
  { code: "IQ", flag: "🇮🇶", dial: "+964",   name: "Iraq" },
  { code: "IE", flag: "🇮🇪", dial: "+353",   name: "Ireland" },
  { code: "IL", flag: "🇮🇱", dial: "+972",   name: "Israel" },
  { code: "IT", flag: "🇮🇹", dial: "+39",    name: "Italy" },
  // ── J ──
  { code: "JM", flag: "🇯🇲", dial: "+1876",  name: "Jamaica" },
  { code: "JP", flag: "🇯🇵", dial: "+81",    name: "Japan" },
  { code: "JO", flag: "🇯🇴", dial: "+962",   name: "Jordan" },
  // ── K ──
  { code: "KZ", flag: "🇰🇿", dial: "+7",     name: "Kazakhstan" },
  { code: "KE", flag: "🇰🇪", dial: "+254",   name: "Kenya" },
  { code: "KI", flag: "🇰🇮", dial: "+686",   name: "Kiribati" },
  { code: "KP", flag: "🇰🇵", dial: "+850",   name: "North Korea" },
  { code: "KR", flag: "🇰🇷", dial: "+82",    name: "South Korea" },
  { code: "KW", flag: "🇰🇼", dial: "+965",   name: "Kuwait" },
  { code: "KG", flag: "🇰🇬", dial: "+996",   name: "Kyrgyzstan" },
  // ── L ──
  { code: "LA", flag: "🇱🇦", dial: "+856",   name: "Laos" },
  { code: "LV", flag: "🇱🇻", dial: "+371",   name: "Latvia" },
  { code: "LB", flag: "🇱🇧", dial: "+961",   name: "Lebanon" },
  { code: "LS", flag: "🇱🇸", dial: "+266",   name: "Lesotho" },
  { code: "LR", flag: "🇱🇷", dial: "+231",   name: "Liberia" },
  { code: "LY", flag: "🇱🇾", dial: "+218",   name: "Libya" },
  { code: "LI", flag: "🇱🇮", dial: "+423",   name: "Liechtenstein" },
  { code: "LT", flag: "🇱🇹", dial: "+370",   name: "Lithuania" },
  { code: "LU", flag: "🇱🇺", dial: "+352",   name: "Luxembourg" },
  // ── M ──
  { code: "MG", flag: "🇲🇬", dial: "+261",   name: "Madagascar" },
  { code: "MW", flag: "🇲🇼", dial: "+265",   name: "Malawi" },
  { code: "MY", flag: "🇲🇾", dial: "+60",    name: "Malaysia" },
  { code: "MV", flag: "🇲🇻", dial: "+960",   name: "Maldives" },
  { code: "ML", flag: "🇲🇱", dial: "+223",   name: "Mali" },
  { code: "MT", flag: "🇲🇹", dial: "+356",   name: "Malta" },
  { code: "MH", flag: "🇲🇭", dial: "+692",   name: "Marshall Islands" },
  { code: "MR", flag: "🇲🇷", dial: "+222",   name: "Mauritania" },
  { code: "MU", flag: "🇲🇺", dial: "+230",   name: "Mauritius" },
  { code: "MX", flag: "🇲🇽", dial: "+52",    name: "Mexico" },
  { code: "FM", flag: "🇫🇲", dial: "+691",   name: "Micronesia" },
  { code: "MD", flag: "🇲🇩", dial: "+373",   name: "Moldova" },
  { code: "MC", flag: "🇲🇨", dial: "+377",   name: "Monaco" },
  { code: "MN", flag: "🇲🇳", dial: "+976",   name: "Mongolia" },
  { code: "ME", flag: "🇲🇪", dial: "+382",   name: "Montenegro" },
  { code: "MA", flag: "🇲🇦", dial: "+212",   name: "Morocco" },
  { code: "MZ", flag: "🇲🇿", dial: "+258",   name: "Mozambique" },
  { code: "MM", flag: "🇲🇲", dial: "+95",    name: "Myanmar" },
  // ── N ──
  { code: "NA", flag: "🇳🇦", dial: "+264",   name: "Namibia" },
  { code: "NR", flag: "🇳🇷", dial: "+674",   name: "Nauru" },
  { code: "NP", flag: "🇳🇵", dial: "+977",   name: "Nepal" },
  { code: "NL", flag: "🇳🇱", dial: "+31",    name: "Netherlands" },
  { code: "NZ", flag: "🇳🇿", dial: "+64",    name: "New Zealand" },
  { code: "NI", flag: "🇳🇮", dial: "+505",   name: "Nicaragua" },
  { code: "NE", flag: "🇳🇪", dial: "+227",   name: "Niger" },
  { code: "NG", flag: "🇳🇬", dial: "+234",   name: "Nigeria" },
  { code: "MK", flag: "🇲🇰", dial: "+389",   name: "North Macedonia" },
  { code: "NO", flag: "🇳🇴", dial: "+47",    name: "Norway" },
  // ── O ──
  { code: "OM", flag: "🇴🇲", dial: "+968",   name: "Oman" },
  // ── P ──
  { code: "PK", flag: "🇵🇰", dial: "+92",    name: "Pakistan" },
  { code: "PW", flag: "🇵🇼", dial: "+680",   name: "Palau" },
  { code: "PS", flag: "🇵🇸", dial: "+970",   name: "Palestine" },
  { code: "PA", flag: "🇵🇦", dial: "+507",   name: "Panama" },
  { code: "PG", flag: "🇵🇬", dial: "+675",   name: "Papua New Guinea" },
  { code: "PY", flag: "🇵🇾", dial: "+595",   name: "Paraguay" },
  { code: "PE", flag: "🇵🇪", dial: "+51",    name: "Peru" },
  { code: "PH", flag: "🇵🇭", dial: "+63",    name: "Philippines" },
  { code: "PL", flag: "🇵🇱", dial: "+48",    name: "Poland" },
  { code: "PT", flag: "🇵🇹", dial: "+351",   name: "Portugal" },
  // ── Q ──
  { code: "QA", flag: "🇶🇦", dial: "+974",   name: "Qatar" },
  // ── R ──
  { code: "RO", flag: "🇷🇴", dial: "+40",    name: "Romania" },
  { code: "RU", flag: "🇷🇺", dial: "+7",     name: "Russia" },
  { code: "RW", flag: "🇷🇼", dial: "+250",   name: "Rwanda" },
  // ── S ──
  { code: "KN", flag: "🇰🇳", dial: "+1869",  name: "Saint Kitts & Nevis" },
  { code: "LC", flag: "🇱🇨", dial: "+1758",  name: "Saint Lucia" },
  { code: "VC", flag: "🇻🇨", dial: "+1784",  name: "Saint Vincent & Grenadines" },
  { code: "WS", flag: "🇼🇸", dial: "+685",   name: "Samoa" },
  { code: "SM", flag: "🇸🇲", dial: "+378",   name: "San Marino" },
  { code: "ST", flag: "🇸🇹", dial: "+239",   name: "São Tomé & Príncipe" },
  { code: "SA", flag: "🇸🇦", dial: "+966",   name: "Saudi Arabia" },
  { code: "SN", flag: "🇸🇳", dial: "+221",   name: "Senegal" },
  { code: "RS", flag: "🇷🇸", dial: "+381",   name: "Serbia" },
  { code: "SC", flag: "🇸🇨", dial: "+248",   name: "Seychelles" },
  { code: "SL", flag: "🇸🇱", dial: "+232",   name: "Sierra Leone" },
  { code: "SK", flag: "🇸🇰", dial: "+421",   name: "Slovakia" },
  { code: "SI", flag: "🇸🇮", dial: "+386",   name: "Slovenia" },
  { code: "SB", flag: "🇸🇧", dial: "+677",   name: "Solomon Islands" },
  { code: "SO", flag: "🇸🇴", dial: "+252",   name: "Somalia" },
  { code: "ZA", flag: "🇿🇦", dial: "+27",    name: "South Africa" },
  { code: "SS", flag: "🇸🇸", dial: "+211",   name: "South Sudan" },
  { code: "ES", flag: "🇪🇸", dial: "+34",    name: "Spain" },
  { code: "LK", flag: "🇱🇰", dial: "+94",    name: "Sri Lanka" },
  { code: "SD", flag: "🇸🇩", dial: "+249",   name: "Sudan" },
  { code: "SR", flag: "🇸🇷", dial: "+597",   name: "Suriname" },
  { code: "SE", flag: "🇸🇪", dial: "+46",    name: "Sweden" },
  { code: "CH", flag: "🇨🇭", dial: "+41",    name: "Switzerland" },
  { code: "SY", flag: "🇸🇾", dial: "+963",   name: "Syria" },
  // ── T ──
  { code: "TW", flag: "🇹🇼", dial: "+886",   name: "Taiwan" },
  { code: "TJ", flag: "🇹🇯", dial: "+992",   name: "Tajikistan" },
  { code: "TZ", flag: "🇹🇿", dial: "+255",   name: "Tanzania" },
  { code: "TH", flag: "🇹🇭", dial: "+66",    name: "Thailand" },
  { code: "TL", flag: "🇹🇱", dial: "+670",   name: "Timor-Leste" },
  { code: "TG", flag: "🇹🇬", dial: "+228",   name: "Togo" },
  { code: "TO", flag: "🇹🇴", dial: "+676",   name: "Tonga" },
  { code: "TT", flag: "🇹🇹", dial: "+1868",  name: "Trinidad & Tobago" },
  { code: "TN", flag: "🇹🇳", dial: "+216",   name: "Tunisia" },
  { code: "TR", flag: "🇹🇷", dial: "+90",    name: "Turkey" },
  { code: "TM", flag: "🇹🇲", dial: "+993",   name: "Turkmenistan" },
  { code: "TV", flag: "🇹🇻", dial: "+688",   name: "Tuvalu" },
  // ── U ──
  { code: "UG", flag: "🇺🇬", dial: "+256",   name: "Uganda" },
  { code: "UA", flag: "🇺🇦", dial: "+380",   name: "Ukraine" },
  { code: "UY", flag: "🇺🇾", dial: "+598",   name: "Uruguay" },
  { code: "UZ", flag: "🇺🇿", dial: "+998",   name: "Uzbekistan" },
  // ── V ──
  { code: "VU", flag: "🇻🇺", dial: "+678",   name: "Vanuatu" },
  { code: "VA", flag: "🇻🇦", dial: "+379",   name: "Vatican City" },
  { code: "VE", flag: "🇻🇪", dial: "+58",    name: "Venezuela" },
  { code: "VN", flag: "🇻🇳", dial: "+84",    name: "Vietnam" },
  // ── Y ──
  { code: "YE", flag: "🇾🇪", dial: "+967",   name: "Yemen" },
  // ── Z ──
  { code: "ZM", flag: "🇿🇲", dial: "+260",   name: "Zambia" },
  { code: "ZW", flag: "🇿🇼", dial: "+263",   name: "Zimbabwe" },
  // ── Territories & Special Regions ──
  { code: "HK", flag: "🇭🇰", dial: "+852",   name: "Hong Kong" },
  { code: "MO", flag: "🇲🇴", dial: "+853",   name: "Macao" },
  { code: "PR", flag: "🇵🇷", dial: "+1787",  name: "Puerto Rico" },
  { code: "GU", flag: "🇬🇺", dial: "+1671",  name: "Guam" },
  { code: "VI", flag: "🇻🇮", dial: "+1340",  name: "U.S. Virgin Islands" },
  { code: "AS", flag: "🇦🇸", dial: "+1684",  name: "American Samoa" },
  { code: "MP", flag: "🇲🇵", dial: "+1670",  name: "N. Mariana Islands" },
  { code: "GP", flag: "🇬🇵", dial: "+590",   name: "Guadeloupe" },
  { code: "MQ", flag: "🇲🇶", dial: "+596",   name: "Martinique" },
  { code: "GF", flag: "🇬🇫", dial: "+594",   name: "French Guiana" },
  { code: "RE", flag: "🇷🇪", dial: "+262",   name: "Réunion" },
  { code: "YT", flag: "🇾🇹", dial: "+262",   name: "Mayotte" },
  { code: "NC", flag: "🇳🇨", dial: "+687",   name: "New Caledonia" },
  { code: "PF", flag: "🇵🇫", dial: "+689",   name: "French Polynesia" },
  { code: "PM", flag: "🇵🇲", dial: "+508",   name: "St. Pierre & Miquelon" },
  { code: "WF", flag: "🇼🇫", dial: "+681",   name: "Wallis & Futuna" },
  { code: "GL", flag: "🇬🇱", dial: "+299",   name: "Greenland" },
  { code: "FO", flag: "🇫🇴", dial: "+298",   name: "Faroe Islands" },
  { code: "GI", flag: "🇬🇮", dial: "+350",   name: "Gibraltar" },
  { code: "JE", flag: "🇯🇪", dial: "+44",    name: "Jersey" },
  { code: "GG", flag: "🇬🇬", dial: "+44",    name: "Guernsey" },
  { code: "IM", flag: "🇮🇲", dial: "+44",    name: "Isle of Man" },
  { code: "AW", flag: "🇦🇼", dial: "+297",   name: "Aruba" },
  { code: "CW", flag: "🇨🇼", dial: "+599",   name: "Curaçao" },
  { code: "BQ", flag: "🇧🇶", dial: "+599",   name: "Bonaire, Sint Eustatius & Saba" },
  { code: "SX", flag: "🇸🇽", dial: "+1721",  name: "Sint Maarten" },
  { code: "MF", flag: "🇲🇫", dial: "+590",   name: "Saint Martin" },
  { code: "BL", flag: "🇧🇱", dial: "+590",   name: "Saint Barthélemy" },
  { code: "AX", flag: "🇦🇽", dial: "+358",   name: "Åland Islands" },
  { code: "CK", flag: "🇨🇰", dial: "+682",   name: "Cook Islands" },
  { code: "NU", flag: "🇳🇺", dial: "+683",   name: "Niue" },
  { code: "TK", flag: "🇹🇰", dial: "+690",   name: "Tokelau" },
  { code: "PN", flag: "🇵🇳", dial: "+64",    name: "Pitcairn Islands" },
  { code: "SH", flag: "🇸🇭", dial: "+290",   name: "Saint Helena" },
  { code: "FK", flag: "🇫🇰", dial: "+500",   name: "Falkland Islands" },
  { code: "IO", flag: "🇮🇴", dial: "+246",   name: "British Indian Ocean Terr." },
  { code: "CC", flag: "🇨🇨", dial: "+61",    name: "Cocos (Keeling) Islands" },
  { code: "CX", flag: "🇨🇽", dial: "+61",    name: "Christmas Island" },
  { code: "NF", flag: "🇳🇫", dial: "+672",   name: "Norfolk Island" },
  { code: "EH", flag: "🇪🇭", dial: "+212",   name: "Western Sahara" },
  { code: "XK", flag: "🇽🇰", dial: "+383",   name: "Kosovo" },
];

/* ── phone number format hints per country ──────────────── */
const PHONE_FORMATS: Record<string, string> = {
  IN: "98765 43210",       US: "(415) 000-0000",   GB: "07700 900000",
  AE: "50 123 4567",       SG: "8123 4567",         AU: "0412 345 678",
  CA: "(416) 000-0000",   DE: "0151 23456789",     FR: "06 12 34 56 78",
  NL: "06 12345678",       JP: "090-1234-5678",     BR: "(11) 91234-5678",
  MX: "(55) 1234 5678",   ZA: "71 123 4567",       NG: "0801 234 5678",
  KE: "0712 345678",       PK: "0301 2345678",      BD: "0171 234 5678",
  ID: "0812 3456 7890",   PH: "0917 123 4567",     MY: "012-345 6789",
  TH: "081 234 5678",     VN: "091 234 5678",      KR: "010-1234-5678",
  IT: "320 123 4567",     ES: "612 345 678",       PT: "912 345 678",
  SE: "070-123 45 67",    NO: "41 23 45 67",       DK: "20 12 34 56",
  CH: "079 123 45 67",    PL: "512 345 678",       RU: "912 345-67-89",
  TR: "0532 123 4567",    SA: "050 123 4567",      QA: "3312 3456",
  EG: "010 1234 5678",    GH: "024 123 4567",      AR: "(11) 1234-5678",
  CO: "(300) 123 4567",   NZ: "021 123 4567",      HK: "5123 4567",
  CN: "138 1234 5678",    IL: "050-123-4567",      IR: "0912 345 6789",
  IQ: "07901 234567",     SY: "0944 123456",       LB: "70 123 456",
  JO: "07 1234 5678",     KW: "5000 0000",         OM: "9012 3456",
  BH: "3600 0000",        YE: "712 345 678",       PK: "0301 2345678",
  LK: "071 234 5678",     MM: "09 123 4567",       KH: "012 345 678",
  LA: "020 5234 5678",    VN: "091 234 5678",      TW: "0912 345 678",
  UA: "067 123 4567",     PL: "512 345 678",       RO: "0712 345 678",
  HU: "30 123 4567",      CZ: "601 234 567",       SK: "0912 345 678",
  AT: "0664 123456",      BE: "0471 12 34 56",     FI: "040 123 4567",
  IE: "087 123 4567",     GR: "691 234 5678",      HR: "091 234 5678",
  RS: "060 123 4567",     BA: "061 123 456",       BG: "087 123 4567",
  MK: "070 123 456",      ME: "067 123 456",       AL: "066 123 4567",
  BY: "029 123-45-67",    MD: "069 123 456",       LV: "21 234 567",
  LT: "612 34567",        EE: "5123 4567",         IS: "611 1234",
  GL: "12 34 56",         FO: "212345",             NO: "41 23 45 67",
  MN: "8812 3456",        KZ: "701 234 5678",      UZ: "90 123 45 67",
  TM: "65 123456",        TJ: "917 12 3456",       KG: "700 123 456",
  AZ: "040 123 45 67",    GE: "555 12 34 56",      AM: "077 123456",
  MA: "0612-345678",      TN: "20 123 456",        DZ: "0550 12 34 56",
  LY: "091 234 5678",     EH: "06 1234567",        SD: "091 234 5678",
  ET: "091 234 5678",     ER: "07 123 456",        SO: "615 123 456",
  KE: "0712 345678",      TZ: "0712 345678",       UG: "0712 345678",
  RW: "0788 123 456",     BI: "79 123456",         DJ: "77 123456",
  CM: "677 123456",       NG: "0801 234 5678",     GH: "024 123 4567",
  SN: "77 123 45 67",     CI: "07 123 456",        BF: "70 12 34 56",
  ML: "70 12 34 56",      NE: "93 123456",         TG: "90 12 34 56",
  BJ: "97 123456",        GN: "622 123456",        SL: "076 123456",
  LR: "077 012 3456",     ZA: "71 123 4567",       ZM: "097 1234567",
  ZW: "071 123 4567",     BW: "71 123456",         NA: "081 123 4567",
  MZ: "84 123 4567",      MG: "032 12 345 67",     MU: "5 2512345",
  SC: "2 512345",         CD: "099 123 4567",      CG: "06 123 4567",
  GA: "06 12 34 56",      GQ: "222 123456",        ST: "990 1234",
  CV: "991 12 34",        MR: "22 12 34 56",       GM: "301 2345",
  GW: "955 012345",       SN: "77 123 45 67",      GH: "024 123 4567",
  BR: "(11) 91234-5678",  AR: "(11) 1234-5678",   CO: "(300) 123 4567",
  VE: "(212) 123-4567",   PE: "(1) 234-5678",     CL: "(2) 2123 4567",
  BO: "(3) 123-4567",     PY: "(21) 123-456",     UY: "(2) 123-456",
  EC: "(2) 234-5678",     GY: "225-1234",         SR: "8-12345",
  GF: "594 1 23 45 67",   MX: "(55) 1234 5678",   GT: "1234 5678",
  BZ: "222-1234",         HN: "9812-3456",        SV: "7012 3456",
  NI: "8123 4567",        CR: "8312 3456",         PA: "6123-4567",
  CU: "(7) 123-4567",     DO: "(809) 123-4567",   HT: "34 12 3456",
  JM: "(876) 123-4567",   TT: "(868) 123-4567",   BB: "(246) 123-4567",
  GD: "(473) 123-4567",   LC: "(758) 123-4567",   VC: "(784) 123-4567",
  DM: "(767) 123-4567",   AG: "(268) 123-4567",   KN: "(869) 123-4567",
  BS: "(242) 123-4567",   TC: "(649) 123-4567",   PR: "(787) 123-4567",
  JP: "090-1234-5678",    KR: "010-1234-5678",    CN: "138 1234 5678",
  TW: "0912 345 678",     HK: "5123 4567",        MO: "6612 3456",
  PH: "0917 123 4567",    ID: "0812 3456 7890",   MY: "012-345 6789",
  SG: "8123 4567",        BN: "711 2345",         TH: "081 234 5678",
  VN: "091 234 5678",     KH: "012 345 678",      LA: "020 5234 5678",
  MM: "09 123 4567",      TL: "7721 2345",        FJ: "701 2345",
  PG: "7012 3456",        SB: "7401 234",         VU: "591 2345",
  WS: "72 12345",         TO: "771 2345",         KI: "73012345",
  NR: "555 1234",         TV: "901234",           PW: "488 1234",
  MH: "235-1234",         FM: "320 1234",         GU: "(671) 123-4567",
  NF: "3 81234",          AU: "0412 345 678",     NZ: "021 123 4567",
};

/* ── max dial digits per country (digit count only, excl. formatting chars) */
const PHONE_MAX_DIGITS: Record<string, number> = {
  // Asia
  IN: 10, PK: 10, BD: 10, LK: 10, NP: 10, MM: 11, TH:  9, VN: 10,
  KH:  9, LA: 11, MY: 10, SG:  8, ID: 12, PH: 10, BN:  7, TL:  8,
  CN: 11, JP: 11, KR: 11, TW: 10, HK:  8, MO:  8, MN:  8, KZ: 10,
  UZ: 12, TM: 11, TJ:  9, KG: 12, AZ:  9, GE:  9, AM:  8,
  // Middle East
  AE:  9, SA:  9, QA:  8, KW:  8, BH:  8, OM:  8, YE:  9, IQ: 10,
  IR: 10, IL: 10, JO:  9, LB:  8, SY: 10, PS: 10,
  // Europe
  GB: 10, IE: 10, FR:  9, DE: 11, IT: 10, ES:  9, PT:  9, NL:  9,
  BE: 10, CH:  9, AT: 10, DK:  8, SE:  9, NO:  8, FI: 10, IS:  9,
  PL:  9, CZ:  9, SK:  9, HU: 10, RO: 10, BG: 10, RS: 10, HR: 10,
  BA:  8, ME:  8, MK:  8, AL:  9, XK:  8, SI:  8, EE:  8, LV:  8,
  LT:  8, BY: 12, UA: 10, MD:  8, RU: 10, TR: 10, GR: 10, CY:  8,
  MT:  8, LU:  9, LI:  7, MC: 12, SM: 10, VA: 11, AD:  6,
  // Americas
  US: 10, CA: 10, MX: 10, BR: 11, AR: 10, CO: 10, CL:  9, PE:  9,
  VE: 10, EC: 10, BO:  8, PY:  9, UY:  9, GY:  7, SR:  7, GF: 10,
  CR:  8, PA:  8, GT:  8, BZ:  7, HN:  8, SV:  8, NI:  8, CU:  8,
  DO: 10, HT:  8, JM: 10, TT: 10, BB: 10, GD: 10, LC: 10, VC: 10,
  DM: 10, AG: 10, KN: 10, BS: 10, PR: 10,
  // Africa
  NG: 10, GH:  9, ZA:  9, KE: 10, TZ: 10, UG: 10, ET:  9, SD:  9,
  EG: 10, MA: 10, DZ:  9, TN:  8, LY: 10, SN: 10, CI: 10, CM:  9,
  AO:  9, MZ:  9, MG: 10, ZM:  9, ZW:  9, RW: 12, BF:  8, ML:  8,
  NE:  8, TG:  8, BJ:  8, GN:  9, SL:  8, LR:  8, MR:  8, GM:  7,
  GW:  9, CV:  7, ST:  7, GQ:  9, GA:  8, CG:  9, CD:  9, CF:  8,
  TD:  8, SS:  9, ER:  7, DJ:  8, SO:  8, BI:  8, MW:  9, BW:  8,
  NA:  9, LS:  8, SZ:  8, SC:  7, MU:  8, MG: 10, KM:  7,
  // Pacific & Territories
  AU:  9, NZ:  9, FJ:  7, PG:  8, SB:  7, VU:  7, WS:  7, TO:  8,
  KI:  8, NR:  7, TV:  6, PW:  7, MH:  7, FM:  7, GU: 10, AS: 10,
  MP: 10, NF:  6, CK:  8, NU:  4, TK:  8, PN:  9,
};

/* ── data ───────────────────────────────────────────────── */
const PROJECT_TYPES = [
  { id: "web",      label: "Web Platform",        sub: "Sites & apps" },
  { id: "ai",       label: "AI Integration",      sub: "LLM & automation" },
  { id: "design",   label: "Design System",       sub: "Brand & UI kit" },
  { id: "full",     label: "Full System",         sub: "End-to-end" },
  { id: "ecom",     label: "Ecommerce",           sub: "Store & growth" },
  { id: "marketing",label: "Performance Marketing", sub: "Ads & funnels" },
  { id: "other",    label: "Other",               sub: "Tell us more" },
];
const NEXT_STEPS = [
  { n: "01", text: "We review your brief within 24 hours." },
  { n: "02", text: "A focused discovery call to map the system." },
  { n: "03", text: "Proposal + timeline delivered in 48 hours." },
];

const E = [0.16, 1, 0.3, 1] as const;

/* ── field ──────────────────────────────────────────────── */
function Field({
  id, label, type = "text", value, onChange, placeholder, required,
  inputRef, textarea, maxLength, pattern, title,
}: {
  id: string; label: string; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  textarea?: boolean; maxLength?: number;
  pattern?: string; title?: string;
}) {
  const fMv  = useMotionValue(0);
  const fSpr = useSpring(fMv, { stiffness: 260, damping: 28 });

  /* box-shadow encodes border + glow — no overlay div needed */
  const shadow = useTransform(fSpr, [0, 1], [
    "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
    "0 0 0 1px rgba(255,92,0,0.7), 0 0 28px rgba(255,92,0,0.13), inset 0 1px 0 rgba(255,255,255,0.07)",
  ]);
  const bg = useTransform(fSpr, [0, 1], [
    "rgba(255,255,255,0.035)",
    "rgba(255,92,0,0.055)",
  ]);

  const sharedEvents = {
    onFocus: () => fMv.set(1),
    onBlur:  () => fMv.set(0),
  };
  const inputClass =
    "w-full bg-transparent rounded-[14px] px-4 py-4 text-white text-[16px] font-sans outline-none focus:outline-none focus:ring-0 border-0 placeholder-white/20 resize-none leading-relaxed";

  const charsLeft = maxLength !== undefined ? maxLength - value.length : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label htmlFor={id} className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/75">
          {label}{required && <span className="text-[#FF5C00] ml-0.5">*</span>}
        </label>
        {charsLeft !== null && (
          <span className="font-mono text-[9px] text-white/20 tabular-nums">
            {charsLeft}
          </span>
        )}
      </div>
      <motion.div className="relative rounded-[14px]" style={{ background: bg, boxShadow: shadow }}>
        {textarea ? (
          <textarea id={id} value={value} rows={5} placeholder={placeholder}
            maxLength={maxLength}
            onChange={e => onChange(e.target.value)}
            style={{ outline: "none", boxShadow: "none", border: "none" }}
            className={inputClass} {...sharedEvents} />
        ) : (
          <input ref={inputRef} id={id} type={type} value={value} required={required}
            placeholder={placeholder}
            pattern={pattern}
            title={title}
            onChange={e => onChange(e.target.value)}
            style={{ outline: "none", boxShadow: "none", border: "none" }}
            className={inputClass} {...sharedEvents} />
        )}
      </motion.div>
    </div>
  );
}

/* ── reusable flag — uses flag-icons CSS (no broken img on Windows) ── */
function FlagImg({ code, size = 20 }: { code: string; size?: number }) {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} fis`}
      style={{
        width: size,
        height: size,
        borderRadius: "3px",
        display: "inline-block",
        flexShrink: 0,
        backgroundSize: "cover",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.10)",
        verticalAlign: "middle",
      }}
      aria-label={code}
    />
  );
}

/* ── phone field with country code picker ───────────────── */
function PhoneField({
  dialCode, selectedCode, onSelect, number, onNumberChange,
}: {
  dialCode: string; selectedCode: string;
  onSelect: (dial: string, code: string) => void;
  number: string;   onNumberChange: (n: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected  = COUNTRIES.find(c => c.code === selectedCode) ?? COUNTRIES[0];
  const format    = PHONE_FORMATS[selected.code] ?? "Phone number";
  const maxDigits = PHONE_MAX_DIGITS[selected.code] ?? 15;
  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
      )
    : COUNTRIES;

  /* focus search when dropdown opens */
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
    else setSearch("");
  }, [open]);

  /* close on outside click */
  useEffect(() => {
    const h = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("touchstart", h);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("touchstart", h);
    };
  }, []);

  /* spring for the number input border glow */
  const fMv  = useMotionValue(0);
  const fSpr = useSpring(fMv, { stiffness: 260, damping: 28 });
  const shadow = useTransform(fSpr, [0, 1], [
    "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
    "0 0 0 1px rgba(255,92,0,0.7), 0 0 28px rgba(255,92,0,0.13), inset 0 1px 0 rgba(255,255,255,0.07)",
  ]);
  const bg = useTransform(fSpr, [0, 1], [
    "rgba(255,255,255,0.035)",
    "rgba(255,92,0,0.055)",
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/75">
          Phone <span className="text-[#FF5C00] ml-0.5">*</span>
        </label>
      </div>

      <div className="flex gap-2 items-stretch" ref={ref}>
        {/* ── Country code button ── */}
        <div className="relative shrink-0">
          <motion.button
            type="button"
            onClick={() => setOpen(o => !o)}
            whileTap={{ scale: 0.97 }}
            className="h-full flex items-center gap-2 rounded-[14px] px-3.5 py-4 cursor-pointer outline-none select-none"
            style={{
              background: open ? "rgba(255,92,0,0.08)" : "rgba(255,255,255,0.035)",
              boxShadow: open
                ? "0 0 0 1px rgba(255,92,0,0.6), 0 0 20px rgba(255,92,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
              transition: "background 0.2s, box-shadow 0.2s",
              minWidth: "96px",
            }}
          >
            <FlagImg code={selected.code} size={20} />
            <span className="font-mono text-[13px] text-white/80 tabular-nums">{selected.dial}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="text-white/35 ml-0.5"
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.span>
          </motion.button>

          {/* ── Dropdown list ── */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.88 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -5, transition: { duration: 0.12, ease: "easeOut" } }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                style={{
                  transformOrigin: "top",
                  willChange: "transform, opacity",
                  background: "#161614",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  zIndex: 60,
                  width: "220px",
                }}
                className="absolute left-0 top-[calc(100%+6px)]"
              >
                {/* orange hairline */}
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(255,92,0,0.5) 50%,transparent)" }} />

                {/* search */}
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center gap-2 bg-white/[0.05] rounded-[10px] px-3 py-2"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-white/30 shrink-0">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <input
                      ref={searchRef}
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search country…"
                      className="bg-transparent flex-1 text-white text-[12px] font-sans outline-none placeholder-white/20 min-w-0"
                      style={{ border: "none", boxShadow: "none" }}
                    />
                  </div>
                </div>

                {/* list */}
                <div className="overflow-y-auto max-h-[220px] [scrollbar-width:thin] [scrollbar-color:rgba(255,92,0,0.3)_transparent]">
                  {filtered.length === 0 && (
                    <p className="px-4 py-3 font-mono text-[11px] text-white/25 text-center">No results</p>
                  )}
                  {filtered.map((c, i) => {
                    const active = c.code === selectedCode;
                    const fmt = PHONE_FORMATS[c.code];
                    return (
                      <motion.button
                        key={c.code}
                        type="button"
                        onClick={() => { onSelect(c.dial, c.code); setOpen(false); }}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: Math.min(i * 0.03, 0.25), ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ background: "rgba(255,92,0,0.07)" }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer"
                        style={{ background: active ? "rgba(255,92,0,0.10)" : "transparent" }}
                      >
                        <FlagImg code={c.code} size={18} />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className={`font-sans text-[12px] truncate ${active ? "text-white" : "text-white/60"}`}>{c.name}</span>
                          {fmt && <span className="font-mono text-[9px] text-white/25 truncate">{fmt}</span>}
                        </div>
                        <span className="font-mono text-[11px] text-white/30 tabular-nums shrink-0">{c.dial}</span>
                        {active && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0 ml-1">
                            <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#FF5C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </motion.svg>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Number input ── */}
        <div className="flex-1 flex flex-col gap-1">
          <motion.div className="relative rounded-[14px]" style={{ background: bg, boxShadow: shadow }}>
            <input
              id="phone"
              type="tel"
              value={number}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9\s\-().]/g, "");
                const digitCount = raw.replace(/\D/g, "").length;
                if (digitCount <= maxDigits) onNumberChange(raw);
              }}
              placeholder={format}
              onFocus={() => fMv.set(1)}
              onBlur={() => fMv.set(0)}
              className="w-full bg-transparent rounded-[14px] px-4 py-4 pr-16 text-white text-[15px] font-mono outline-none focus:outline-none focus:ring-0 border-0 placeholder-white/20 leading-relaxed"
              style={{ outline: "none", boxShadow: "none", border: "none" }}
            />
            {/* live digit counter inside input */}
            {(() => {
              const typed = number.replace(/\D/g, "").length;
              const full  = typed >= maxDigits;
              return (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tabular-nums pointer-events-none select-none"
                  style={{ color: full ? "#FF5C00" : "rgba(255,255,255,0.20)" }}
                >
                  {typed}/{maxDigits}
                </span>
              );
            })()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── premium dropdown selector ──────────────────────────── */
function Dropdown({
  options, value, onChange, renderAfterOption,
}: {
  options: { id: string; label: string; sub?: string }[];
  value: string[]; onChange: (ids: string[]) => void;
  renderAfterOption?: (id: string, selected: boolean) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter(o => value.includes(o.id));

  const hasSelected = selectedOptions.length > 0;

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between gap-3 rounded-[14px] px-4 py-3.5 cursor-pointer outline-none text-left"
        style={{
          background: open || hasSelected ? "rgba(255,92,0,0.07)" : "rgba(255,255,255,0.035)",
          boxShadow: open
            ? "0 0 0 1px rgba(255,92,0,0.6), 0 0 28px rgba(255,92,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06)"
            : hasSelected
              ? "0 0 0 1px rgba(255,92,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          {selectedOptions.length > 0 ? (
            <>
              <span className="font-sans text-[13px] font-medium text-white leading-tight truncate">
                {selectedOptions.map(o => o.label).join(", ")}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#FF5C00]/60">
                {selectedOptions.length} Selected
              </span>
            </>
          ) : (
            <span className="font-sans text-[13px] text-white/35">Select project types…</span>
          )}
        </div>

        {/* chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="shrink-0 text-white/40"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </motion.button>

      {/* dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.88 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -5, transition: { duration: 0.12, ease: "easeOut" } }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            style={{
              transformOrigin: "top",
              willChange: "transform, opacity",
              background: "#161614",
              boxShadow: "0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-50"
          >
            {/* top orange hairline */}
            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(255,92,0,0.5) 50%,transparent)" }} />

            {options.map((opt, i) => {
              const on = value.includes(opt.id);
              return (
                <div key={opt.id}>
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (on) {
                        onChange(value.filter(v => v !== opt.id));
                      } else {
                        onChange([...value, opt.id]);
                      }
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ background: "rgba(255,92,0,0.07)" }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer relative"
                    style={{ background: on ? "rgba(255,92,0,0.10)" : "transparent" }}
                  >
                    {/* active dot */}
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] shrink-0"
                      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.4 }}
                      transition={{ duration: 0.15 }}
                    />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className={`font-sans text-[13px] font-medium leading-tight ${on ? "text-white" : "text-white/65"}`}>
                        {opt.label}
                      </span>
                      {opt.sub && (
                        <span className={`font-mono text-[9px] uppercase tracking-[0.16em] ${on ? "text-[#FF5C00]/60" : "text-white/22"}`}>
                          {opt.sub}
                        </span>
                      )}
                    </div>
                    {on && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#FF5C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </motion.button>
                  {renderAfterOption?.(opt.id, on)}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── animated checkmark ─────────────────────────────────── */
function SuccessCheck() {
  return (
    <motion.svg width="72" height="72" viewBox="0 0 72 72" fill="none"
      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.05 }}
    >
      <motion.circle cx="36" cy="36" r="33" stroke="#FF5C00" strokeWidth="1.5"
        fill="rgba(255,92,0,0.09)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: E, delay: 0.1 }}
      />
      <motion.path d="M23 37l10 10 16-19" stroke="#FF5C00" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: E, delay: 0.52 }}
      />
    </motion.svg>
  );
}

/* ── stagger wrapper ─────────────────────────────────────── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: E }}>
      {children}
    </motion.div>
  );
}

/* ══ main component ════════════════════════════════════════ */
export default function BuildFormModal({ isOpen, onClose }: Props) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [dialCode,    setDialCode]    = useState("+91");
  const [selectedCode, setSelectedCode] = useState("IN");
  const [phoneNum,    setPhoneNum]    = useState("");
  const [brief,     setBrief]     = useState("");
  const [ptype,     setPtype]     = useState<string[]>([]);
  const [otherPtype, setOtherPtype] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setName(""); setEmail(""); setDialCode("+91"); setSelectedCode("IN"); setPhoneNum(""); setBrief(""); setPtype([]); setOtherPtype("");
    }, 600);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phoneNum.trim()) return;
    setStatus("submitting");
    const fullPhone = `${dialCode} ${phoneNum}`;
    try {
      const typeLabels = PROJECT_TYPES.filter((p) => ptype.includes(p.id)).map(p => p.label);
      let typeLabel = typeLabels.length > 0 ? typeLabels.join(", ") : "Not specified";
      if (ptype.includes("other") && otherPtype.trim()) {
        typeLabel += ` (Other: ${otherPtype.trim()})`;
      }
      const response = await fetch("https://formsubmit.co/ajax/Connect@citizenofdigitalage.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: fullPhone,
          project_type: typeLabel,
          project_brief: brief,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Something went wrong. Please try emailing us directly.");
    }
  }, [name, email, dialCode, phoneNum, ptype, otherPtype, brief]);

  const panelTransition = { type: "tween" as const, duration: 0.65, ease: E };
  const exitTransition  = { type: "tween" as const, duration: 0.55, ease: E };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="bd"
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[6px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: E }}
            onClick={onClose}
            aria-hidden
          />

          {/* sheet panel */}
          <motion.div
            key="panel"
            role="dialog" aria-modal="true" aria-label="Start a project"
            className="fixed inset-x-0 bottom-0 top-[24px] z-[201] rounded-t-[24px] md:inset-0 md:rounded-none"
            style={{
              background: "#0C0C0A",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              willChange: "transform, opacity",
            }}
            initial={{ y: "100%", opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.95, transition: exitTransition }}
            transition={reduced ? { duration: 0 } : panelTransition}
          >
            {/* subtle graph grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.028]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* top orange line */}
            <motion.div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,92,0,0.75) 50%,transparent)" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: E }}
            />

            {/* close btn */}
            <motion.button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.10)" }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <X size={15} strokeWidth={2} />
            </motion.button>

            {/* scrollable body */}
            <div
              className="flex-1 overflow-y-auto relative z-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              data-lenis-prevent
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="min-h-full grid grid-cols-1 lg:grid-cols-[400px_1fr]">

                {/* LEFT panel */}
                <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 border-r border-white/[0.06] relative">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,92,0,0.09) 0%, transparent 70%)" }}
                  />
                  <div className="relative">
                    <FadeUp delay={0.22}>
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#FF5C00]/80">
                        CODA · Start a project
                      </span>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                      <h2 className="font-instrument text-white leading-[1.04] tracking-[-0.03em] mt-8"
                        style={{ fontSize: "clamp(30px, 3vw, 50px)" }}>
                        Let&apos;s build something<br />
                        that <span className="italic text-[#FF5C00]">compounds.</span>
                      </h2>
                    </FadeUp>
                    <FadeUp delay={0.38}>
                      <p className="font-sans text-[14px] text-white/40 leading-[1.8] mt-5 max-w-[280px]">
                        One focused conversation is all it takes. Tell us what you&apos;re
                        building and we&apos;ll map the system together.
                      </p>
                    </FadeUp>
                  </div>

                  <div className="relative">
                    <FadeUp delay={0.46}>
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20 mb-6">
                        What happens next
                      </p>
                    </FadeUp>
                    <div className="space-y-5">
                      {NEXT_STEPS.map((s, i) => (
                        <FadeUp key={s.n} delay={0.52 + i * 0.07}>
                          <div className="flex items-start gap-4">
                            <span className="font-mono text-[10px] text-[#FF5C00]/70 mt-0.5 shrink-0">{s.n}</span>
                            <p className="font-sans text-[13px] text-white/40 leading-[1.65]">{s.text}</p>
                          </div>
                        </FadeUp>
                      ))}
                    </div>
                    <FadeUp delay={0.74}>
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Connect@citizenofdigitalage.com"
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors duration-300">
                        Connect@citizenofdigitalage.com <ArrowRight size={9} />
                      </a>
                    </FadeUp>
                  </div>
                </div>

                {/* RIGHT: form */}
                <div className="p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col">

                  {/* mobile header */}
                  <div className="lg:hidden mb-8">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF5C00]/80">
                      Start a project
                    </span>
                    <h2 className="font-instrument text-white text-[28px] tracking-[-0.025em] leading-tight mt-3">
                      Let&apos;s build something that{" "}
                      <span className="italic text-[#FF5C00]">compounds.</span>
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "success" ? (

                      /* success */
                      <motion.div key="success"
                        className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-16"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SuccessCheck />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65, duration: 0.45, ease: E }}
                        >
                          <h3 className="font-instrument text-white text-[30px] tracking-[-0.02em] mb-3">
                            We&apos;re on it.
                          </h3>
                          <p className="font-sans text-[15px] text-white/40 max-w-[260px] leading-[1.75]">
                            Expect a reply within 24 hours. We&apos;ll come prepared.
                          </p>
                        </motion.div>
                        <motion.button onClick={onClose}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 }}
                          whileHover={{ scale: 1.012 }} whileTap={{ scale: 0.978 }}
                          className="mt-6 relative font-sans font-semibold text-[14px] tracking-[0.04em] text-white rounded-2xl px-10 py-[13px] overflow-hidden cursor-pointer"
                          style={{
                            background: "linear-gradient(135deg,#FF7A2E 0%,#FF5C00 55%,#E84000 100%)",
                            boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 40px rgba(255,92,0,0.28)",
                          }}
                        >
                          Close
                        </motion.button>
                      </motion.div>

                    ) : (

                      /* form */
                      <motion.form key="form" onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* name + email */}
                        <FadeUp delay={0.25}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field id="name" label="Your name" required value={name}
                              onChange={setName} placeholder="What do they call you?" inputRef={nameRef} />
                            <Field id="email" label="Work email" type="email" required
                              value={email} onChange={setEmail} placeholder="you@company.com"
                              pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                              title="Please enter a valid email address (e.g. name@domain.com)"
                            />
                          </div>
                        </FadeUp>

                        {/* phone */}
                        <FadeUp delay={0.31}>
                          <PhoneField
                            dialCode={dialCode}
                            selectedCode={selectedCode}
                            onSelect={(dial, code) => { setDialCode(dial); setSelectedCode(code); }}
                            number={phoneNum}
                            onNumberChange={setPhoneNum}
                          />
                        </FadeUp>

                        {/* project type */}
                        <FadeUp delay={0.37}>
                          <div className="flex flex-col gap-3">
                            <div>
                              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/75 mb-2.5">
                                What are we building?
                              </p>
                              <Dropdown 
                                options={PROJECT_TYPES} 
                                value={ptype} 
                                onChange={setPtype}
                                renderAfterOption={(id, selected) => {
                                  if (id !== "other") return null;
                                  return (
                                    <AnimatePresence>
                                      {selected && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2, ease: E }}
                                          className="px-4 pb-3"
                                        >
                                          <input 
                                            type="text" 
                                            value={otherPtype}
                                            onChange={(e) => setOtherPtype(e.target.value)}
                                            placeholder="Please specify..."
                                            className="w-full bg-black/20 rounded-[10px] px-3 py-2 text-white text-[13px] font-sans outline-none border border-white/10 focus:border-[#FF5C00]/50 placeholder-white/20"
                                            autoFocus
                                          />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </FadeUp>

                        {/* brief */}
                        <FadeUp delay={0.44}>
                          <Field id="brief" label="Tell us about your project" textarea
                            value={brief} onChange={setBrief} maxLength={600}
                            placeholder="Describe what you're building, the problem you're solving, and what success looks like…"
                          />
                        </FadeUp>

                        {/* submit */}
                        <FadeUp delay={0.51}>
                          <motion.button
                            type="submit"
                            disabled={status === "submitting" || !name.trim() || !email.trim() || !phoneNum.trim()}
                            whileHover={{ scale: status === "idle" ? 1.012 : 1 }}
                            whileTap={{ scale: status === "idle" ? 0.978 : 1 }}
                            transition={{ type: "spring", stiffness: 360, damping: 26 }}
                            className="relative w-full flex items-center justify-center gap-3 rounded-2xl py-[15px] font-sans font-semibold text-[14px] tracking-[0.04em] text-white overflow-hidden disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                            style={{
                              background: "linear-gradient(135deg,#FF7A2E 0%,#FF5C00 55%,#E84000 100%)",
                              boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 40px rgba(255,92,0,0.28)",
                            }}
                          >
                            {/* shimmer sweep */}
                            <motion.span aria-hidden
                              className="absolute inset-0 -skew-x-12 pointer-events-none"
                              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.11),transparent)" }}
                              initial={{ x: "-150%" }}
                              whileHover={{ x: "150%" }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                            />
                            <span className="relative z-10 flex items-center gap-2.5">
                              {status === "submitting" ? (
                                <>
                                  <motion.span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                                  />
                                  Sending…
                                </>
                              ) : (
                                <>Send brief <ArrowRight size={15} strokeWidth={1.75} /></>
                              )}
                            </span>
                          </motion.button>

                          <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/18 mt-3.5">
                            No commitment · We respond within 24 hours
                          </p>
                        </FadeUp>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
