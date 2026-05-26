(function (root) {
  "use strict";

  const MS_HOUR = 60 * 60 * 1000;
  const MS_DAY = 24 * MS_HOUR;
  const JST_OFFSET = 9 * MS_HOUR;

  const STEMS = [
    { char: "甲", reading: "きのえ", element: "木", polarity: "陽" },
    { char: "乙", reading: "きのと", element: "木", polarity: "陰" },
    { char: "丙", reading: "ひのえ", element: "火", polarity: "陽" },
    { char: "丁", reading: "ひのと", element: "火", polarity: "陰" },
    { char: "戊", reading: "つちのえ", element: "土", polarity: "陽" },
    { char: "己", reading: "つちのと", element: "土", polarity: "陰" },
    { char: "庚", reading: "かのえ", element: "金", polarity: "陽" },
    { char: "辛", reading: "かのと", element: "金", polarity: "陰" },
    { char: "壬", reading: "みずのえ", element: "水", polarity: "陽" },
    { char: "癸", reading: "みずのと", element: "水", polarity: "陰" }
  ];

  const BRANCHES = [
    { char: "子", reading: "ね", element: "水" },
    { char: "丑", reading: "うし", element: "土" },
    { char: "寅", reading: "とら", element: "木" },
    { char: "卯", reading: "う", element: "木" },
    { char: "辰", reading: "たつ", element: "土" },
    { char: "巳", reading: "み", element: "火" },
    { char: "午", reading: "うま", element: "火" },
    { char: "未", reading: "ひつじ", element: "土" },
    { char: "申", reading: "さる", element: "金" },
    { char: "酉", reading: "とり", element: "金" },
    { char: "戌", reading: "いぬ", element: "土" },
    { char: "亥", reading: "い", element: "水" }
  ];

  const ELEMENT_ORDER = ["木", "火", "土", "金", "水"];
  const PRODUCES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const CONTROLS = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

  const TEN_STAR = {
    peerSame: "貫索星",
    peerOpposite: "石門星",
    outputSame: "鳳閣星",
    outputOpposite: "調舒星",
    wealthSame: "禄存星",
    wealthOpposite: "司禄星",
    officerSame: "車騎星",
    officerOpposite: "牽牛星",
    resourceSame: "龍高星",
    resourceOpposite: "玉堂星"
  };

  const LIFE_STARS = {
    甲: { 酉: ["天報星", 3], 戌: ["天印星", 6], 亥: ["天貴星", 9], 子: ["天恍星", 7], 丑: ["天南星", 10], 寅: ["天禄星", 11], 卯: ["天将星", 12], 辰: ["天堂星", 8], 巳: ["天胡星", 4], 午: ["天極星", 2], 未: ["天庫星", 5], 申: ["天馳星", 1] },
    乙: { 申: ["天報星", 3], 未: ["天印星", 6], 午: ["天貴星", 9], 巳: ["天恍星", 7], 辰: ["天南星", 10], 卯: ["天禄星", 11], 寅: ["天将星", 12], 丑: ["天堂星", 8], 子: ["天胡星", 4], 亥: ["天極星", 2], 戌: ["天庫星", 5], 酉: ["天馳星", 1] },
    丙: { 子: ["天報星", 3], 丑: ["天印星", 6], 寅: ["天貴星", 9], 卯: ["天恍星", 7], 辰: ["天南星", 10], 巳: ["天禄星", 11], 午: ["天将星", 12], 未: ["天堂星", 8], 申: ["天胡星", 4], 酉: ["天極星", 2], 戌: ["天庫星", 5], 亥: ["天馳星", 1] },
    丁: { 亥: ["天報星", 3], 戌: ["天印星", 6], 酉: ["天貴星", 9], 申: ["天恍星", 7], 未: ["天南星", 10], 午: ["天禄星", 11], 巳: ["天将星", 12], 辰: ["天堂星", 8], 卯: ["天胡星", 4], 寅: ["天極星", 2], 丑: ["天庫星", 5], 子: ["天馳星", 1] },
    戊: { 子: ["天報星", 3], 丑: ["天印星", 6], 寅: ["天貴星", 9], 卯: ["天恍星", 7], 辰: ["天南星", 10], 巳: ["天禄星", 11], 午: ["天将星", 12], 未: ["天堂星", 8], 申: ["天胡星", 4], 酉: ["天極星", 2], 戌: ["天庫星", 5], 亥: ["天馳星", 1] },
    己: { 亥: ["天報星", 3], 戌: ["天印星", 6], 酉: ["天貴星", 9], 申: ["天恍星", 7], 未: ["天南星", 10], 午: ["天禄星", 11], 巳: ["天将星", 12], 辰: ["天堂星", 8], 卯: ["天胡星", 4], 寅: ["天極星", 2], 丑: ["天庫星", 5], 子: ["天馳星", 1] },
    庚: { 卯: ["天報星", 3], 辰: ["天印星", 6], 巳: ["天貴星", 9], 午: ["天恍星", 7], 未: ["天南星", 10], 申: ["天禄星", 11], 酉: ["天将星", 12], 戌: ["天堂星", 8], 亥: ["天胡星", 4], 子: ["天極星", 2], 丑: ["天庫星", 5], 寅: ["天馳星", 1] },
    辛: { 寅: ["天報星", 3], 丑: ["天印星", 6], 子: ["天貴星", 9], 亥: ["天恍星", 7], 戌: ["天南星", 10], 酉: ["天禄星", 11], 申: ["天将星", 12], 未: ["天堂星", 8], 午: ["天胡星", 4], 巳: ["天極星", 2], 辰: ["天庫星", 5], 卯: ["天馳星", 1] },
    壬: { 午: ["天報星", 3], 未: ["天印星", 6], 申: ["天貴星", 9], 酉: ["天恍星", 7], 戌: ["天南星", 10], 亥: ["天禄星", 11], 子: ["天将星", 12], 丑: ["天堂星", 8], 寅: ["天胡星", 4], 卯: ["天極星", 2], 辰: ["天庫星", 5], 巳: ["天馳星", 1] },
    癸: { 巳: ["天報星", 3], 辰: ["天印星", 6], 卯: ["天貴星", 9], 寅: ["天恍星", 7], 丑: ["天南星", 10], 子: ["天禄星", 11], 亥: ["天将星", 12], 戌: ["天堂星", 8], 酉: ["天胡星", 4], 申: ["天極星", 2], 未: ["天庫星", 5], 午: ["天馳星", 1] }
  };

  const SOLAR_TERM_DEFS = [
    { name: "小寒", angle: 285, section: true, branch: "丑" },
    { name: "大寒", angle: 300, section: false },
    { name: "立春", angle: 315, section: true, branch: "寅" },
    { name: "雨水", angle: 330, section: false },
    { name: "啓蟄", angle: 345, section: true, branch: "卯" },
    { name: "春分", angle: 360, section: false },
    { name: "清明", angle: 375, section: true, branch: "辰" },
    { name: "穀雨", angle: 390, section: false },
    { name: "立夏", angle: 405, section: true, branch: "巳" },
    { name: "小満", angle: 420, section: false },
    { name: "芒種", angle: 435, section: true, branch: "午" },
    { name: "夏至", angle: 450, section: false },
    { name: "小暑", angle: 465, section: true, branch: "未" },
    { name: "大暑", angle: 480, section: false },
    { name: "立秋", angle: 495, section: true, branch: "申" },
    { name: "処暑", angle: 510, section: false },
    { name: "白露", angle: 525, section: true, branch: "酉" },
    { name: "秋分", angle: 540, section: false },
    { name: "寒露", angle: 555, section: true, branch: "戌" },
    { name: "霜降", angle: 570, section: false },
    { name: "立冬", angle: 585, section: true, branch: "亥" },
    { name: "小雪", angle: 600, section: false },
    { name: "大雪", angle: 615, section: true, branch: "子" },
    { name: "冬至", angle: 630, section: false }
  ];

  const HIDDEN_RULES = {
    子: [{ until: Infinity, stem: "癸" }],
    丑: [{ until: 9, stem: "癸" }, { until: 12, stem: "辛" }, { until: Infinity, stem: "己" }],
    寅: [{ until: 7, stem: "戊" }, { until: 14, stem: "丙" }, { until: Infinity, stem: "甲" }],
    卯: [{ until: Infinity, stem: "乙" }],
    辰: [{ until: 9, stem: "乙" }, { until: 12, stem: "癸" }, { until: Infinity, stem: "戊" }],
    巳: [{ until: 5, stem: "戊" }, { until: 14, stem: "庚" }, { until: Infinity, stem: "丙" }],
    午: [{ until: 19, stem: "己" }, { until: Infinity, stem: "丁" }],
    未: [{ until: 9, stem: "丁" }, { until: 12, stem: "乙" }, { until: Infinity, stem: "己" }],
    申: [{ until: 10, stem: "戊" }, { until: 13, stem: "壬" }, { until: Infinity, stem: "庚" }],
    酉: [{ until: Infinity, stem: "辛" }],
    戌: [{ until: 9, stem: "辛" }, { until: 12, stem: "丁" }, { until: Infinity, stem: "戊" }],
    亥: [{ until: 12, stem: "甲" }, { until: Infinity, stem: "壬" }]
  };

  const stemIndex = Object.fromEntries(STEMS.map((item, index) => [item.char, index]));
  const branchIndex = Object.fromEntries(BRANCHES.map((item, index) => [item.char, index]));
  const termCache = new Map();

  function mod(value, base) {
    return ((value % base) + base) % base;
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function normalizeDeg(value) {
    return mod(value, 360);
  }

  function makeJstDate(year, month, day, hour = 12, minute = 0) {
    return new Date(Date.UTC(year, month - 1, day, hour, minute) - JST_OFFSET);
  }

  function toJstParts(date) {
    const shifted = new Date(date.getTime() + JST_OFFSET);
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
      hour: shifted.getUTCHours(),
      minute: shifted.getUTCMinutes()
    };
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatJst(date, withTime = true) {
    const parts = toJstParts(date);
    const base = `${parts.year}/${pad2(parts.month)}/${pad2(parts.day)}`;
    return withTime ? `${base} ${pad2(parts.hour)}:${pad2(parts.minute)}` : base;
  }

  function julianDay(date) {
    return date.getTime() / MS_DAY + 2440587.5;
  }

  function sunLongitude(date) {
    const jd = julianDay(date);
    const t = (jd - 2451545.0) / 36525;
    const l0 = normalizeDeg(280.46646 + t * (36000.76983 + t * 0.0003032));
    const m = normalizeDeg(357.52911 + t * (35999.05029 - 0.0001537 * t));
    const c = Math.sin(degToRad(m)) * (1.914602 - t * (0.004817 + 0.000014 * t))
      + Math.sin(degToRad(2 * m)) * (0.019993 - 0.000101 * t)
      + Math.sin(degToRad(3 * m)) * 0.000289;
    const trueLongitude = l0 + c;
    const omega = 125.04 - 1934.136 * t;
    return normalizeDeg(trueLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega)));
  }

  function longitudeNear(date, target) {
    let longitude = sunLongitude(date);
    while (longitude < target - 180) longitude += 360;
    while (longitude > target + 180) longitude -= 360;
    return longitude;
  }

  function findSolarTermTime(lowTime, highTime, target) {
    let low = lowTime;
    let high = highTime;
    for (let index = 0; index < 44; index += 1) {
      const mid = Math.floor((low + high) / 2);
      if (longitudeNear(new Date(mid), target) < target) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return new Date(high);
  }

  function solarTermsForYear(year) {
    if (termCache.has(year)) return termCache.get(year);

    const start = Date.UTC(year, 0, 1) - JST_OFFSET;
    const end = Date.UTC(year + 1, 0, 1) - JST_OFFSET;
    const step = 6 * MS_HOUR;
    const terms = [];
    let defIndex = 0;
    let previousTime = start;
    let previousRaw = sunLongitude(new Date(previousTime));
    let offset = 0;
    let previousContinuous = previousRaw;

    for (let currentTime = start + step; currentTime <= end + step && defIndex < SOLAR_TERM_DEFS.length; currentTime += step) {
      const raw = sunLongitude(new Date(currentTime));
      if (raw + offset < previousContinuous - 180) offset += 360;
      const currentContinuous = raw + offset;

      while (defIndex < SOLAR_TERM_DEFS.length && SOLAR_TERM_DEFS[defIndex].angle <= currentContinuous) {
        const def = SOLAR_TERM_DEFS[defIndex];
        const date = findSolarTermTime(previousTime, currentTime, def.angle);
        terms.push({ ...def, angle: mod(def.angle, 360), date });
        defIndex += 1;
      }

      previousTime = currentTime;
      previousContinuous = currentContinuous;
    }

    termCache.set(year, terms);
    return terms;
  }

  function allTermsNear(date) {
    const { year } = toJstParts(date);
    return [year - 1, year, year + 1]
      .flatMap((targetYear) => solarTermsForYear(targetYear))
      .sort((a, b) => a.date - b.date);
  }

  function sectionTermsNear(date) {
    return allTermsNear(date).filter((term) => term.section);
  }

  function previousSection(date) {
    return sectionTermsNear(date).filter((term) => term.date <= date).pop();
  }

  function nextSection(date) {
    return sectionTermsNear(date).find((term) => term.date > date);
  }

  function cycleIndexForStemBranch(stemChar, branchChar) {
    const sIndex = stemIndex[stemChar];
    const bIndex = branchIndex[branchChar];
    for (let index = 0; index < 60; index += 1) {
      if (index % 10 === sIndex && index % 12 === bIndex) return index;
    }
    throw new Error(`Invalid stem/branch pair: ${stemChar}${branchChar}`);
  }

  function pillarFromCycle(index) {
    const normalized = mod(index, 60);
    const sIndex = normalized % 10;
    const bIndex = normalized % 12;
    return {
      cycleIndex: normalized,
      number: normalized + 1,
      stem: STEMS[sIndex].char,
      branch: BRANCHES[bIndex].char,
      stemIndex: sIndex,
      branchIndex: bIndex,
      label: `${STEMS[sIndex].char}${BRANCHES[bIndex].char}`,
      stemInfo: STEMS[sIndex],
      branchInfo: BRANCHES[bIndex]
    };
  }

  function yearPillarForSolarYear(year) {
    const pillar = pillarFromCycle(year - 1984);
    const start = solarTermsForYear(year).find((term) => term.name === "立春").date;
    const end = solarTermsForYear(year + 1).find((term) => term.name === "立春").date;
    return { ...pillar, solarYear: year, start, end };
  }

  function yearPillarForDate(date) {
    const { year } = toJstParts(date);
    const lichun = solarTermsForYear(year).find((term) => term.name === "立春").date;
    return yearPillarForSolarYear(date >= lichun ? year : year - 1);
  }

  function monthPillarForDate(date) {
    const section = previousSection(date);
    const yPillar = yearPillarForDate(date);
    const monthNumber = mod(branchIndex[section.branch] - branchIndex.寅, 12);
    const mStemIndex = mod((yPillar.stemIndex % 5) * 2 + 2 + monthNumber, 10);
    const mBranchIndex = branchIndex[section.branch];
    const cIndex = cycleIndexForStemBranch(STEMS[mStemIndex].char, BRANCHES[mBranchIndex].char);
    const next = nextSection(section.date);
    return { ...pillarFromCycle(cIndex), section, start: section.date, end: next ? next.date : null };
  }

  function dayPillarForDate(date) {
    const parts = toJstParts(date);
    const targetMidnight = makeJstDate(parts.year, parts.month, parts.day, 0, 0);
    const referenceMidnight = makeJstDate(2000, 1, 1, 0, 0);
    const elapsed = Math.round((targetMidnight - referenceMidnight) / MS_DAY);
    return pillarFromCycle(54 + elapsed);
  }

  function hiddenStemDayIndex(elapsedDays) {
    return Math.max(0, Math.ceil(elapsedDays - 1e-9));
  }

  function hiddenStem(branchChar, elapsedDays) {
    const dayIndex = hiddenStemDayIndex(elapsedDays);
    const rules = HIDDEN_RULES[branchChar];
    return rules.find((rule) => dayIndex <= rule.until).stem;
  }

  function tenStar(dayStemChar, targetStemChar) {
    const self = STEMS[stemIndex[dayStemChar]];
    const target = STEMS[stemIndex[targetStemChar]];
    const samePolarity = self.polarity === target.polarity;

    if (self.element === target.element) {
      return samePolarity ? TEN_STAR.peerSame : TEN_STAR.peerOpposite;
    }
    if (PRODUCES[self.element] === target.element) {
      return samePolarity ? TEN_STAR.outputSame : TEN_STAR.outputOpposite;
    }
    if (CONTROLS[self.element] === target.element) {
      return samePolarity ? TEN_STAR.wealthSame : TEN_STAR.wealthOpposite;
    }
    if (CONTROLS[target.element] === self.element) {
      return samePolarity ? TEN_STAR.officerSame : TEN_STAR.officerOpposite;
    }
    if (PRODUCES[target.element] === self.element) {
      return samePolarity ? TEN_STAR.resourceSame : TEN_STAR.resourceOpposite;
    }
    return "";
  }

  function lifeStar(dayStemChar, branchChar) {
    const [name, energy] = LIFE_STARS[dayStemChar][branchChar];
    return { name, energy };
  }

  function ageParts(age) {
    let years = Math.floor(Math.max(0, age));
    let months = Math.round((Math.max(0, age) - years) * 12);
    if (months >= 12) {
      years += 1;
      months -= 12;
    }
    return { years, months };
  }

  function formatAge(age) {
    const parts = ageParts(age);
    return `${parts.years}歳${parts.months ? `${parts.months}か月` : ""}`;
  }

  function directionFor(gender, yearStemChar) {
    const polarity = STEMS[stemIndex[yearStemChar]].polarity;
    const forward = (gender === "male" && polarity === "陽") || (gender === "female" && polarity === "陰");
    return forward ? 1 : -1;
  }

  function pillarLuck(dayStemChar, pillar) {
    return {
      ...pillar,
      tenStar: tenStar(dayStemChar, pillar.stem),
      lifeStar: lifeStar(dayStemChar, pillar.branch)
    };
  }

  function fiveElementBalance(chart) {
    const counts = Object.fromEntries(ELEMENT_ORDER.map((element) => [element, 0]));
    const stems = [chart.year.stem, chart.month.stem, chart.day.stem, chart.hidden.year, chart.hidden.month, chart.hidden.day];
    const branches = [chart.year.branch, chart.month.branch, chart.day.branch];

    stems.forEach((s) => {
      counts[STEMS[stemIndex[s]].element] += 1;
    });
    branches.forEach((b) => {
      counts[BRANCHES[branchIndex[b]].element] += 1;
    });
    return counts;
  }

  function parseBirthInput(dateValue, timeValue) {
    if (!dateValue) throw new Error("生年月日を入力してください。");
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hour, minute] = timeValue ? timeValue.split(":").map(Number) : [12, 0];
    return makeJstDate(year, month, day, hour, minute);
  }

  function calculateNatal({ dateValue, timeValue, gender = "male", targetYear }) {
    const birthDate = parseBirthInput(dateValue, timeValue);
    const year = yearPillarForDate(birthDate);
    const month = monthPillarForDate(birthDate);
    const day = dayPillarForDate(birthDate);
    const elapsedDays = Math.max(0, (birthDate - month.section.date) / MS_DAY);
    const elapsedDayIndex = hiddenStemDayIndex(elapsedDays);
    const hidden = {
      year: hiddenStem(year.branch, elapsedDays),
      month: hiddenStem(month.branch, elapsedDays),
      day: hiddenStem(day.branch, elapsedDays)
    };
    const direction = directionFor(gender, year.stem);
    const boundary = direction === 1 ? nextSection(birthDate) : previousSection(birthDate);
    const daysToBoundary = Math.abs(boundary.date - birthDate) / MS_DAY;
    const startAge = daysToBoundary / 3;
    const bigLuck = Array.from({ length: 10 }, (_, index) => {
      const pillar = pillarFromCycle(month.cycleIndex + direction * (index + 1));
      const start = startAge + index * 10;
      const end = startAge + (index + 1) * 10;
      return {
        index: index + 1,
        startAge: start,
        endAge: end,
        ...pillarLuck(day.stem, pillar)
      };
    });
    const chart = {
      birthDate,
      gender,
      targetYear,
      year,
      month,
      day,
      hidden,
      elapsedDays,
      elapsedDayIndex,
      section: month.section,
      direction,
      boundary,
      daysToBoundary,
      startAge,
      bigLuck
    };
    chart.yang = {
      north: tenStar(day.stem, year.stem),
      south: tenStar(day.stem, month.stem),
      center: tenStar(day.stem, hidden.month),
      east: tenStar(day.stem, hidden.year),
      west: tenStar(day.stem, hidden.day),
      early: lifeStar(day.stem, year.branch),
      middle: lifeStar(day.stem, month.branch),
      later: lifeStar(day.stem, day.branch)
    };
    chart.balance = fiveElementBalance(chart);
    chart.yearLucks = annualLucks(chart, targetYear || toJstParts(new Date()).year);
    chart.monthLucks = monthlyLucks(chart, targetYear || toJstParts(new Date()).year);
    return chart;
  }

  function annualLucks(chart, centerYear, span = 11) {
    const start = centerYear - Math.floor(span / 2);
    return Array.from({ length: span }, (_, index) => {
      const year = start + index;
      const pillar = yearPillarForSolarYear(year);
      return {
        year,
        start: pillar.start,
        end: pillar.end,
        ...pillarLuck(chart.day.stem, pillar)
      };
    });
  }

  function monthlyLucks(chart, year) {
    const sections = solarTermsForYear(year).filter((term) => term.section);
    return sections.map((section) => {
      const sampleDate = new Date(section.date.getTime() + MS_HOUR);
      const pillar = monthPillarForDate(sampleDate);
      return {
        year,
        sectionName: section.name,
        start: section.date,
        end: pillar.end,
        ...pillarLuck(chart.day.stem, pillar)
      };
    });
  }

  const api = {
    STEMS,
    BRANCHES,
    ELEMENT_ORDER,
    SOLAR_TERM_DEFS,
    makeJstDate,
    toJstParts,
    formatJst,
    sunLongitude,
    solarTermsForYear,
    yearPillarForDate,
    yearPillarForSolarYear,
    monthPillarForDate,
    dayPillarForDate,
    hiddenStem,
    tenStar,
    lifeStar,
    calculateNatal,
    annualLucks,
    monthlyLucks,
    formatAge,
    pillarFromCycle
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SanmeiGaku = api;
})(typeof window !== "undefined" ? window : globalThis);
