"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var AppComponent = (function () {
    function AppComponent(http) {
        var _this = this;
        this.people = [];
        this.currentPeople = [];
        this.reviewSessions = [];
        var ctrl = this;
        var isNow = function (begin, end) {
            var currentDay = new Date();
            if (currentDay.getHours() < (Number(begin[0])))
                return false;
            if ((currentDay.getHours() == (Number(begin[0]))) && (currentDay.getMinutes() < (Number(begin[1]))))
                return false;
            if ((currentDay.getHours() > (Number(end[0]))))
                return false;
            if ((currentDay.getHours() == (Number(end[0]))) && (currentDay.getMinutes() > (Number(end[1]))))
                return false;
            return true;
        };
        var isCorrectDay = function (days) {
            var currentDay = new Date();
            for (var i = days.length - 1; i >= 0; i--) {
                if (days[i] == 'S' && currentDay.getDay() == 0)
                    return true;
                if (days[i] == 'M' && currentDay.getDay() == 1)
                    return true;
                if (days[i] == 'T' && currentDay.getDay() == 2)
                    return true;
                if (days[i] == 'W' && currentDay.getDay() == 3)
                    return true;
                if (days[i] == 'R' && currentDay.getDay() == 4)
                    return true;
                if (days[i] == 'F' && currentDay.getDay() == 5)
                    return true;
            }
            return false;
        };
        var updateTeachers = function () {
            console.log("Checking");
            var newPeople = [];
            var newReviewSessions = [];
            console.log(ctrl.people);
            for (var i = ctrl.people.length - 1; i >= 0; i--) {
                console.log(ctrl.people[i]);
                if (ctrl.people[i].office_hours) {
                    for (var j = ctrl.people[i].office_hours.length - 1; j >= 0; j--) {
                        var normalized = ctrl.people[i].office_hours[j].time.replace(' ', '').replace('pm', '').replace('am', '').split('(')[0];
                        var correctTime = false;
                        for (var k = normalized.split(',').length - 1; k >= 0; k--) {
                            var time = normalized.split(',')[k].split('-');
                            var begin = time[0].split(':');
                            var end = time[1].split(':');
                            //convert to military time
                            if (Number(begin[0]) < 9)
                                begin[0] = (Number(begin[0]) + 12).toString();
                            if (Number(end[0]) < 9)
                                end[0] = (Number(end[0]) + 12).toString();
                            correctTime = correctTime || (isNow(begin, end) && isCorrectDay(ctrl.people[i].office_hours[j].day.split('')));
                        }
                        if (ctrl.people[i].office_hours[j].time.replace(' ', '').replace('pm', '').replace('am', '').split('(').length > 1 && correctTime && isCorrectDay(['S'])) {
                            var review = ctrl.people[i].office_hours[j].time.replace(' ', '').replace('pm', '').replace('am', '').split('(')[1].split(')')[0];
                            if (newReviewSessions.indexOf(review) == -1 && review) {
                                newReviewSessions.push(review);
                            }
                        }
                        else if (correctTime)
                            newPeople.push(ctrl.people[i]);
                    }
                }
            }
            ctrl.currentPeople = newPeople;
            ctrl.reviewSessions = newReviewSessions;
        };
        http.get('api/teachers')
            .subscribe(function (people) { return _this.people = JSON.parse(people._body).peer_teachers; }, function (err) { return console.log(err); }, function () { return updateTeachers(); });
        setInterval(updateTeachers, 5000);
    }
    ;
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            viewProviders: [http_1.HTTP_PROVIDERS],
            templateUrl: 'teachers.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map