function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let curmonth = undefined;
let elemi = -1;
let startdate = new Date();
if (startdate.getDate() >= 29) {
	elemi = -2;
}

function fromFormat(time)
{
	let hours = parseInt(time.split("h")[0]);
	let minutes = parseInt(time.split("h")[1]);
	return hours * 60 + minutes;
}

function toFormat(time)
{
	let hours = Math.floor(time / 60);
	let minutes = time % 60;
	return `${hours}h${minutes > 9 ? minutes : "0" + minutes}`;
}

waitForElm("#user-locations > g").then((first) => {
	let timeByMonth = {};
	let elements = document.querySelectorAll("#user-locations > g");
	let monthelements = document.querySelectorAll("#user-locations > text");
	for (let i = elements.length - 1; i >= 0; i--) {
		let elem = elements[i];
		let date = new Date();
		let time = elem.getAttribute("data-original-title");
		let hours = parseInt(time.split("h")[0]);
		let minutes = parseInt(time.split("h")[1]);
		date.setDate(date.getDate() - (elements.length - 1 - i));
		let month = date.getMonth();
		let temp = new Date(date);
		let omonth = month;
		if (temp.getDate() >= 29) {
			month = (temp.getMonth() + 1) % 12;
		}
		if (!timeByMonth[month]) {
			timeByMonth[month] = { hours: 0, minutes: 0 }
		}
		if (timeByMonth[month].maxDay === undefined || timeByMonth[month].maxDay < date.getDate()) {
			if (omonth == month) {
				timeByMonth[month].maxDay = date.getDate();
			}
		}
		timeByMonth[month].totalDays = (timeByMonth[month].totalDays || 0) + 1;
		timeByMonth[month].hours += hours;
		timeByMonth[month].minutes += minutes;
		if (timeByMonth[month].minutes >= 60) {
			timeByMonth[month].hours += 1;
			timeByMonth[month].minutes -= 60;
		}
		if (month != curmonth || month === undefined) {
			elemi++;
			curmonth = month;
		}
		if (elemi >= 0)
		{
			let elem = monthelements[monthelements.length - elemi - 1];
			let arr = timeByMonth[month];
			let Time = `${timeByMonth[month].hours}h${timeByMonth[month].minutes}`;
			let TimeLeft = (120 * 60) - fromFormat(Time);
			let TimePerDayLeft = toFormat(Math.floor(TimeLeft / (29 - timeByMonth[month].maxDay)));
			if (TimeLeft < 0) {
				TimePerDayLeft = "0h0";	
			}
			elem.textContent = `${monthNames[month]}  ${timeByMonth[month].hours}h${timeByMonth[month].minutes} ${TimeLeft > 0 ? `(${TimePerDayLeft}/d)` : ""}`;
		}
	}
})

