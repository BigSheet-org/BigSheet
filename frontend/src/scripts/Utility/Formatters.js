import Data from "../../assets/static/Data.js";

class Formatters {

    /**
     * Constants : This static object is used to store constants that are used in the application,
     * such as timeouts durations, refresh delays, ...
     */
    static CONSTANTS = {
        timeout_duration: 0,        // <- In seconds
        refresh_delay: 60,          // <- In seconds
    }

    static DAYS = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
    ]

    static MONTHS = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ]

    /**
     * formatDate : This method formats a date into a dd/mm/yyyy hh:mm date.
     * @param dateString Date to format.
     * @returns {string} Formatted date.
     */
    static formatDate(dateString) {
        if (dateString !== null) {
            let date = new Date(dateString)
            let day = date.getDate()
            let month = date.getMonth() + 1     // Months starts at 0. Why ? Idk...
            let year = date.getFullYear()
            let hour = date.getHours()
            let minutes = date.getMinutes()


            // The following conditions allows us to print a "0" before the first digit if it contains only one digit.
            // In result, instead of getting an output of '1', it will be printed '01' for easier date comprehension.
            if (day < 10) {
                day = "0" + day
            }
            if (month < 10) {
                month = "0" + month
            }
            if (hour < 10) {
                hour = "0" + hour
            }
            if (minutes < 10) {
                minutes = "0" + minutes
            }

            // Returns the formatted date
            return day + "-" + month + "-" + year + " " + hour + ":" + minutes;
        } else {
            return ""
        }
    }

    /**
     * formatDateWithTime : This method formats a date into a dd/mm/yyyy hh:mm date.
     * @param dateString Date to format.
     * @returns {{part1: string, part2: string}} Formatted date. Date and time are separated
     */
    static formatDateWithTime(dateString) {
        if (dateString !== null) {

            let date = new Date(dateString)
            let day = this.DAYS[date.getDay()]
            let dayNumber = date.getDate()
            let month = this.MONTHS[date.getMonth()]
            let year = date.getFullYear()
            let hour = date.getHours()
            let minutes = date.getMinutes()

            // The following conditions allows us to print a "0" before the first digit if it contains only one digit.
            // In result, instead of getting an output of '1', it will be printed '01' for easier date comprehension.
            if (day < 10) {
                day = "0" + day
            }
            if (month < 10) {
                month = "0" + month
            }
            if (hour < 10) {
                hour = "0" + hour
            }
            if (minutes < 10) {
                minutes = "0" + minutes
            }

            // Returns the formatted date
            return {
                part1: day + " " + dayNumber + " " + month + " " + year,
                part2: hour + " h " + minutes
            }
        } else {
            return ""
        }
    }

    /**
     * formatDateWithTimeAndSeconds : This method formats a date into a dd/mm/yyyy hh:mm date.
     * @param dateString Date to format.
     * @returns {{part1: string, part2: string}} Formatted date. Date and time are separated
     */
    static formatDateWithTimeAndSeconds(dateString) {
        if (dateString !== null) {

            let date = new Date(dateString)
            let day = this.DAYS[date.getDay()]
            let dayNumber = date.getDate()
            let month = this.MONTHS[date.getMonth()]
            let year = date.getFullYear()
            let hour = date.getHours()
            let minutes = date.getMinutes()
            let seconds = date.getSeconds()

            // The following conditions allows us to print a "0" before the first digit if it contains only one digit.
            // In result, instead of getting an output of '1', it will be printed '01' for easier date comprehension.
            if (day < 10) {
                day = "0" + day
            }
            if (month < 10) {
                month = "0" + month
            }
            if (hour < 10) {
                hour = "0" + hour
            }
            if (minutes < 10) {
                minutes = "0" + minutes
            }
            if (seconds < 10) {
                seconds = "0" + seconds
            }

            // Returns the formatted date
            return {
                part1: day + " " + dayNumber + " " + month + " " + year,
                part2: hour + " h " + minutes + " : " + seconds
            }
        } else {
            return ""
        }
    }


    /**
     * formatPhone : This method formats a phone number into a xx.xx.xx.xx.xx format.
     * @param phone_string Phone to format.
     * @returns {string} Formatted Phone number.
     */
    static formatPhone(phone_string) {
        if (phone_string !== "" && phone_string != null) {
            const cleaned_number = phone_string.replace(/\D/g, '');
            let part1, part2, part3, part4, part5

            // Checking the phone's length
            if (cleaned_number.length < 2) {
                return cleaned_number; // Returns the not-formatted phone if it is not long enough.
            }
            // Creating the variable to separate pairs of digits.
            let sep_char = Data.PROGRAM_VALUES.PHONE_SEPARATION_CHAR

            // Splitting the phone number in pairs of digits.
            part1 = cleaned_number.slice(0, 2);
            part2 = cleaned_number.slice(2, 4);
            part3 = cleaned_number.slice(4, 6);
            part4 = cleaned_number.slice(6, 8);
            part5 = cleaned_number.slice(8, 10);

            if (part2 === "") {
                return `${part1}`
            } else if (part3 === "") {
                return `${part1}${sep_char}${part2}`
            } else if (part4 === "") {
                return `${part1}${sep_char}${part2}${sep_char}${part3}`
            } else if (part5 === "") {
                return `${part1}${sep_char}${part2}${sep_char}${part3}${sep_char}${part4}`
            }
            return `${part1}${sep_char}${part2}${sep_char}${part3}${sep_char}${part4}${sep_char}${part5}`
        } else {
            return ""
        }
    }

    /**
     * unformatPhone : This function strips the formatted phone number from '.' chars to allow it to be sent to the API.
     * @param phone Phone to unformat.
     * @returns {String}  Unformatted phone.
     */
    static unformatPhone(phone) {
        let separator = Data.PROGRAM_VALUES.PHONE_SEPARATION_CHAR
        return phone.split(separator).join('');
    }
}

export default Formatters