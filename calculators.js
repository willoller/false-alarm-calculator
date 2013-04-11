var A = angular;
var app = angular.module('falseAlarmCalculators', ["ui"])
.filter('ordinal', function () {
  return function (number) {
    var int = number;
    if ( ( int % 10 >= 4 ) || ( (int % 100) - (int % 10) == 10 ) ) {
        return String(number) + "th";
    }

    var suffixes = ['th', 'st', 'nd', 'rd'];
    return String(number) + suffixes[(int % 10)];
  };
});

function MainCtrl($scope){
  $scope.dataRows = [];
  $scope.dataJson = [];
  $scope.csvData = "OccupancyID,Address,RunNumber,AlarmDateTime\n" +
    "0001,12 Main St,13-001,2013-01-01 08:22:33\n"+
    "0001,12 Main St,13-002,2013-01-03 08:22:33\n"+
    "0001,12 Main St,13-003,2013-01-04 08:22:33\n"+
    "0001,12 Main St,13-004,2013-01-20 08:22:33\n"+
    "0001,12 Main St,13-005,2013-06-04 08:22:33\n";

  $scope.updateDataRowsFromCsvData = function(){
    var objects = $.csv.toObjects($scope.csvData);
    $.each(objects, function(e,o){
      o.AlarmDateTime = moment(o.AlarmDateTime);
    });
    $scope.dataRows = objects;
    $scope.dataJson = $.toJSON($.csv.toObjects($scope.csvData));
    $scope.resetForm();
  }

  $scope.rules = [
    {
      scope:      'single',
      alarms:     1,
      timeCount:  1,
      timeframe:  'month',
      billAmount: 0,
    },
    {
      scope:      'single',
      alarms:     2,
      timeCount:  1,
      timeframe:  'month',
      billAmount: 300,
    },
    {
      scope:      'all',
      alarms:     2,
      timeCount:  1,
      timeframe:  'month',
      billAmount: 400,
    },
    {
      scope:      'single',
      alarms:     3,
      timeCount:  1,
      timeframe:  'month',
      billAmount: 600,
    }
  ];

  $scope.addRule = function() {
    // This seems weird; like global pollution
    $scope.rules.push({
      scope:      $scope.scope,
      alarms:     $scope.alarms,
      timeCount:  $scope.timeCount,
      timeframe:  $scope.timeframe,
      billAmount: $scope.billAmount
    });

    $scope.resetForm();
  }

  $scope.addTextRule = function() {
    var rule = readRuleText($scope.textRule);
    if (rule) {
      $scope.rules.push(rule);
      $scope.resetForm();
    }
  }

  $scope.removeRule = function($index) {
    $scope.rules.splice($index,1);
    $scope.resetForm();
  }

  $scope.resetForm = function() {
    $scope.alarms = '';
    $scope.timeframe = '';
    $scope.timeCount = '';
    $scope.billAmount = '';

    // Resetting visibility
    $scope.scope = '';
    $scope.bill  = '';
    $scope.textRule = '';

    $scope.updateResults();
  }

  $scope.ruleDisplay = function() {
  }

  $scope.showAllAlarmQuestions = function() {
  }

  $scope.showOneAlarmQuestions = function() {
  }

  $scope.scopeClass = function(match) {
    if ($scope.scope == match) {
      return 'btn-primary';
    }
  }
  $scope.calClass = function(match) {
    if ($scope.calendar == match) {
      return 'btn-primary';
    }
  }
  $scope.billClass = function(match) {
    if ($scope.bill == match) {
      return 'btn-primary';
    }
  }

  $scope.allOccupantRuns = function(item) {
    var matchedData = [];

    // Get all the matching data excluding self
    $.each($scope.dataRows, function(i,d) {
      if (d !== item) {
        if (d.OccupancyID == item.OccupancyID && d.AlarmDateTime < item.AlarmDateTime) {
          matchedData.push(d);
        }
      }
    });

    return matchedData;
  }

  $scope.successClass = function(exp) {
    if (!(!exp)) {
      return 'text-success';
    }
    return '';
  }

  $scope.results = [];
  $scope.updateResults = function() {
    var res = [];

    $.each($scope.dataRows, function(i, row){
      var myBillable = $scope.determineBillable(row);
      var myRule = "";

      if (myBillable.rule.billAmount) {
        myRule += myBillable.rule.alarms;
        if (myBillable.rule.scope == 'all') {
          myRule += '+ ';
        }
        myRule += " in " +
          myBillable.rule.timeCount +
          " " + myBillable.rule.timeframe +
          " (" + myBillable.sequence + ")";
      }

      var extras = [];
      A.forEach(row, function(value, title){
        if (title != "OccupancyID" && title != "AlarmDateTime") {
          extras.push({title: title, value: value});
        }
        // these are the extra columns
      });

      res.push({
        OccupancyID:   row.OccupancyID,
        AlarmDateTime: row.AlarmDateTime,
        sequence:      myBillable.sequence,
        billAmount:    myBillable.rule.billAmount,
        rule:          myRule,
        extras:        extras
      });
    });

    $scope.results = res;
  }

  $scope.sum = function(data, column) {
    var res = 0;
    $.each(data, function(i,d){
      res += +d[column];
    });
    return res;
  }

  $scope.determineBillable = function(item) {
    var matchedData = $scope.allOccupantRuns(item);
    var matchedRules = [];
    var billable = {
      sequence: 1,
      rule: {
        billAmount: 0
      }
    };

    // Loop through rules and see which match item's sequence
    A.forEach($scope.rules, function(rule) {

      // This line is a hack. I hate it.
      // Should be able to do this sort of async'ly and return the billable
      // object whenever I want. The important thing is: a billable will hit
      // the first matching rule in the list and "fall out".
      if (billable.rule.billAmount == 0) {

        billable.sequence = 1;
        // this doesn't handle calendar dates
        var offset = moment.duration(+rule.timeCount, rule.timeframe);
        var timeStart = moment(item.AlarmDateTime).subtract(offset);

        // Get the sequence of this Alarm in the rule's timeframe
        A.forEach(matchedData, function(d){
          // If the Alarm is after timeStart then it "counts" toward the rule
          if (d.AlarmDateTime >= timeStart) {
            billable.sequence += 1;
          }
        });

        if (rule.scope == 'all' && billable.sequence > rule.alarms) {
          billable = {
            sequence: billable.sequence,
            rule: rule
          }
        } else if (rule.scope == 'single' && billable.sequence == rule.alarms) {
          billable = {
            sequence: billable.sequence,
            rule: rule
          }
        }

      } // this closes the hack.

    });

    return billable;
  }

  $scope.updateDataRowsFromCsvData();

  readRuleText = function(ruleText) {
    // "The 3rd alarm in 6 months will be billed for 300.";
    // "The 3rd alarm in 6 calendar months will be billed for 300.22.";
    // "The 3 alarm in 6 months will not be billed.";
    // "4 in 6 calendar months bill at 400.00";
    // "2 in 6 calendar months no bill.";
    var singleExp = /^(?:The )?(\d+)(?:st|nd|rd|th)?(?: alarm)? in (\d+) ((?:calendar )?(?:\w+[^s]))(?:s)? (?:\D+)((?:\$)?\d+(?:\.\d+)?)?(?:\.)?$/;

    // "Any alarm after the 3rd alarm in 6 months will be billed for 300.";
    // "All alarms after 3rd alarm in 6 calendar months will be billed for 300.22.";
    // "After 3 in 6 months no bill.";
    // "All after 4 in 6 calendar months bill at 400.00.";
    var allExp = /^(?:(?:\D+)?(?:fter|ny)\D+)?(\d+)(?:st|nd|rd|th)?(?: alarm)? in (\d+) ((?:calendar )?(?:\w+[^s]))(?:s)? (?:\D+)(\d+(?:\.\d+)?)?(?:\.)?$/;

    var singleMatch = singleExp.exec(ruleText);
    var allMatch    = allExp.exec(ruleText);

    if (singleMatch !== null) {
      return {
        scope:      'single',
        alarms:     singleMatch[1],
        timeCount:  singleMatch[2],
        timeframe:  singleMatch[3],
        billAmount: singleMatch[4],
      }
    } else if (allMatch !== null) {
      return {
        scope:      'all',
        alarms:     allMatch[1],
        timeCount:  allMatch[2],
        timeframe:  allMatch[3],
        billAmount: allMatch[4],
      }
    }
  }
}
