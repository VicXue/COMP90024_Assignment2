package controllers

import (
	"example/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// GetVictoriaExpenses
// @Summary return the Victoria Government's expenses toward mental health services
// @Description return the Victoria Government's expenses toward mental health services
// @Tags analysis
// @Accept json
// @Produce json
// @Success 200 {string} GetVictoriaExpenses
// @Router /analysis/victoria-expenses [get]
func GetVictoriaExpenses(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/analysis_db/758f8d49bee4190a93c6e182702bd110",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}
