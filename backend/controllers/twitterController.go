package controllers

import (
	"example/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
)

// Retrieve necessary environment variables.
var dbUser = os.Getenv("DB_USER")
var dbPass = os.Getenv("DB_PASS")
var dbHost = os.Getenv("DB_HOST")

// GetTwitterSentiment
// @Summary return tw_sentiment
// @Description return the tw_sentiment MapReduce view in the tweets database
// @Tags twitter
// @Accept json
// @Produce json
// @Success 200 {string} GetTwitterSentiment
// @Router /twitter/sentiment [get]
func GetTwitterSentiment(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/tweets/_design/tw_sentiment/_view/avg_gcc_sentiment?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// GetTwitterCount
// @Summary return tw_count
// @Description return the tw_count MapReduce view in the tweets database
// @Tags twitter
// @Accept json
// @Produce json
// @Success 200 {string} GetTwitterCount
// @Router /twitter/count [get]
func GetTwitterCount(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/tweets/_design/tw_count/_view/count_sentiment?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}
